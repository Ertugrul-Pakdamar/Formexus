package service

import (
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/formexus/backend/internal/domain"
	"github.com/formexus/backend/internal/dto"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FormService interface {
	CreateForm(ownerID primitive.ObjectID, req *dto.CreateFormRequest) (*dto.FormResponse, error)
	GetForm(id primitive.ObjectID) (*dto.FormResponse, error)
	GetPublicForm(slug string) (*dto.PublicFormResponse, error)
	GetUserForms(ownerID primitive.ObjectID) ([]*dto.FormListResponse, error)
	UpdateForm(formID, ownerID primitive.ObjectID, req *dto.UpdateFormRequest) (*dto.FormResponse, error)
	DeleteForm(formID, ownerID primitive.ObjectID) error
	DuplicateForm(formID, ownerID primitive.ObjectID, req *dto.DuplicateFormRequest) (*dto.FormResponse, error)

	SubmitForm(slug string, req *dto.SubmitFormRequest, userID *primitive.ObjectID, ipAddress, userAgent string) (*dto.SubmissionResponse, error)
	GetFormSubmissions(formID, ownerID primitive.ObjectID) ([]*dto.SubmissionResponse, error)
	GetFormStats(formID, ownerID primitive.ObjectID) (*dto.FormStatsResponse, error)
	DeleteSubmission(submissionID, ownerID primitive.ObjectID) error
}

type formService struct {
	formRepo domain.FormRepository
	userRepo domain.UserRepository
}

func NewFormService(formRepo domain.FormRepository, userRepo domain.UserRepository) FormService {
	return &formService{
		formRepo: formRepo,
		userRepo: userRepo,
	}
}

func (s *formService) CreateForm(ownerID primitive.ObjectID, req *dto.CreateFormRequest) (*dto.FormResponse, error) {
	// Generate slug from title
	slug := generateSlug(req.Title)

	// Ensure slug is unique by appending timestamp if needed
	slug = fmt.Sprintf("%s-%d", slug, time.Now().Unix())

	// Create default settings if not provided
	settings := domain.FormSettings{
		IsPublished:          false,
		AcceptResponses:      true,
		AllowMultipleSubmits: false,
		RequireLogin:         false,
		ShowProgressBar:      true,
		ConfirmationMessage:  "Thank you for your submission!",
	}
	if req.Settings != nil {
		settings = *req.Settings
	}

	// Create default theme if not provided
	theme := domain.FormTheme{
		PrimaryColor:    "#6366f1",
		BackgroundColor: "#ffffff",
		FontFamily:      "Inter, system-ui, sans-serif",
	}
	if req.Theme != nil {
		theme = *req.Theme
	}

	form := &domain.Form{
		OwnerID:     ownerID,
		Title:       req.Title,
		Description: req.Description,
		Fields:      req.Fields,
		Settings:    settings,
		Theme:       theme,
		Slug:        slug,
	}

	if form.Fields == nil {
		form.Fields = []domain.FormField{}
	}

	if err := s.formRepo.Create(form); err != nil {
		return nil, fmt.Errorf("failed to create form: %w", err)
	}

	// Update user's forms array
	user, err := s.userRepo.FindByID(ownerID)
	if err == nil {
		user.Forms = append(user.Forms, form.ID)
		_ = s.userRepo.Update(user)
	}

	return s.toFormResponse(form), nil
}

func (s *formService) GetForm(id primitive.ObjectID) (*dto.FormResponse, error) {
	form, err := s.formRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	return s.toFormResponse(form), nil
}

func (s *formService) GetPublicForm(slug string) (*dto.PublicFormResponse, error) {
	form, err := s.formRepo.FindBySlug(slug)
	if err != nil {
		return nil, err
	}

	// Increment view count
	_ = s.formRepo.IncrementViewCount(form.ID)

	// Check if form is published
	if !form.Settings.IsPublished {
		return nil, fmt.Errorf("form is not published")
	}

	// Check if form is accepting responses
	if !form.Settings.AcceptResponses {
		return nil, fmt.Errorf("form is not accepting responses")
	}

	// Check date restrictions
	now := time.Now()
	if form.Settings.StartDate != nil && now.Before(*form.Settings.StartDate) {
		return nil, fmt.Errorf("form is not yet available")
	}
	if form.Settings.EndDate != nil && now.After(*form.Settings.EndDate) {
		return nil, fmt.Errorf("form has ended")
	}

	return s.toPublicFormResponse(form), nil
}

func (s *formService) GetUserForms(ownerID primitive.ObjectID) ([]*dto.FormListResponse, error) {
	forms, err := s.formRepo.FindByOwnerID(ownerID)
	if err != nil {
		return nil, err
	}

	responses := make([]*dto.FormListResponse, len(forms))
	for i, form := range forms {
		responses[i] = s.toFormListResponse(form)
	}

	return responses, nil
}

func (s *formService) UpdateForm(formID, ownerID primitive.ObjectID, req *dto.UpdateFormRequest) (*dto.FormResponse, error) {
	form, err := s.formRepo.FindByID(formID)
	if err != nil {
		return nil, err
	}

	// Check ownership
	if form.OwnerID != ownerID {
		return nil, fmt.Errorf("unauthorized: you don't own this form")
	}

	// Update fields
	if req.Title != nil {
		form.Title = *req.Title
	}
	if req.Description != nil {
		form.Description = *req.Description
	}
	if req.Fields != nil {
		form.Fields = req.Fields
	}
	if req.Settings != nil {
		form.Settings = *req.Settings
	}
	if req.Theme != nil {
		form.Theme = *req.Theme
	}

	if err := s.formRepo.Update(form); err != nil {
		return nil, fmt.Errorf("failed to update form: %w", err)
	}

	return s.toFormResponse(form), nil
}

func (s *formService) DeleteForm(formID, ownerID primitive.ObjectID) error {
	form, err := s.formRepo.FindByID(formID)
	if err != nil {
		return err
	}

	// Check ownership
	if form.OwnerID != ownerID {
		return fmt.Errorf("unauthorized: you don't own this form")
	}

	// Remove from user's forms array
	user, err := s.userRepo.FindByID(ownerID)
	if err == nil {
		for i, fid := range user.Forms {
			if fid == formID {
				user.Forms = append(user.Forms[:i], user.Forms[i+1:]...)
				_ = s.userRepo.Update(user)
				break
			}
		}
	}

	return s.formRepo.Delete(formID)
}

func (s *formService) DuplicateForm(formID, ownerID primitive.ObjectID, req *dto.DuplicateFormRequest) (*dto.FormResponse, error) {
	original, err := s.formRepo.FindByID(formID)
	if err != nil {
		return nil, err
	}

	// Check ownership
	if original.OwnerID != ownerID {
		return nil, fmt.Errorf("unauthorized: you don't own this form")
	}

	// Create new title
	title := original.Title + " (Copy)"
	if req.Title != "" {
		title = req.Title
	}

	// Create duplicate
	duplicate := &domain.Form{
		OwnerID:     ownerID,
		Title:       title,
		Description: original.Description,
		Fields:      original.Fields,
		Settings:    original.Settings,
		Theme:       original.Theme,
		Slug:        fmt.Sprintf("%s-%d", generateSlug(title), time.Now().Unix()),
	}

	// Mark as not published
	duplicate.Settings.IsPublished = false

	if err := s.formRepo.Create(duplicate); err != nil {
		return nil, fmt.Errorf("failed to duplicate form: %w", err)
	}

	// Update user's forms array
	user, err := s.userRepo.FindByID(ownerID)
	if err == nil {
		user.Forms = append(user.Forms, duplicate.ID)
		_ = s.userRepo.Update(user)
	}

	return s.toFormResponse(duplicate), nil
}

func (s *formService) SubmitForm(slug string, req *dto.SubmitFormRequest, userID *primitive.ObjectID, ipAddress, userAgent string) (*dto.SubmissionResponse, error) {
	form, err := s.formRepo.FindBySlug(slug)
	if err != nil {
		return nil, err
	}

	// Check if form is published and accepting responses
	if !form.Settings.IsPublished || !form.Settings.AcceptResponses {
		return nil, fmt.Errorf("form is not accepting responses")
	}

	// Check date restrictions
	now := time.Now()
	if form.Settings.StartDate != nil && now.Before(*form.Settings.StartDate) {
		return nil, fmt.Errorf("form is not yet available")
	}
	if form.Settings.EndDate != nil && now.After(*form.Settings.EndDate) {
		return nil, fmt.Errorf("form has ended")
	}

	// Check if login is required
	if form.Settings.RequireLogin && userID == nil {
		return nil, fmt.Errorf("login required to submit this form")
	}

	// Validate required fields
	for _, field := range form.Fields {
		if field.Required {
			value, exists := req.Responses[field.ID]
			if !exists || value == nil || value == "" {
				return nil, fmt.Errorf("field '%s' is required", field.Label)
			}
		}
	}

	submission := &domain.FormSubmission{
		FormID:    form.ID,
		UserID:    userID,
		Responses: req.Responses,
		IPAddress: ipAddress,
		UserAgent: userAgent,
	}

	if err := s.formRepo.CreateSubmission(submission); err != nil {
		return nil, fmt.Errorf("failed to submit form: %w", err)
	}

	return s.toSubmissionResponse(submission), nil
}

func (s *formService) GetFormSubmissions(formID, ownerID primitive.ObjectID) ([]*dto.SubmissionResponse, error) {
	form, err := s.formRepo.FindByID(formID)
	if err != nil {
		return nil, err
	}

	// Check ownership
	if form.OwnerID != ownerID {
		return nil, fmt.Errorf("unauthorized: you don't own this form")
	}

	submissions, err := s.formRepo.FindSubmissionsByFormID(formID)
	if err != nil {
		return nil, err
	}

	responses := make([]*dto.SubmissionResponse, len(submissions))
	for i, sub := range submissions {
		responses[i] = s.toSubmissionResponse(sub)
	}

	return responses, nil
}

func (s *formService) GetFormStats(formID, ownerID primitive.ObjectID) (*dto.FormStatsResponse, error) {
	form, err := s.formRepo.FindByID(formID)
	if err != nil {
		return nil, err
	}

	// Check ownership
	if form.OwnerID != ownerID {
		return nil, fmt.Errorf("unauthorized: you don't own this form")
	}

	submissions, err := s.formRepo.FindSubmissionsByFormID(formID)
	if err != nil {
		return nil, err
	}

	completionRate := 0.0
	if form.ViewCount > 0 {
		completionRate = float64(form.SubmitCount) / float64(form.ViewCount) * 100
	}

	var lastSubmission *time.Time
	if len(submissions) > 0 {
		lastSubmission = &submissions[0].SubmittedAt
	}

	stats := &dto.FormStatsResponse{
		FormID:         form.ID.Hex(),
		ViewCount:      form.ViewCount,
		SubmitCount:    form.SubmitCount,
		CompletionRate: completionRate,
		LastSubmission: lastSubmission,
	}

	return stats, nil
}

func (s *formService) DeleteSubmission(submissionID, ownerID primitive.ObjectID) error {
	submission, err := s.formRepo.FindSubmissionByID(submissionID)
	if err != nil {
		return err
	}

	// Check form ownership
	form, err := s.formRepo.FindByID(submission.FormID)
	if err != nil {
		return err
	}

	if form.OwnerID != ownerID {
		return fmt.Errorf("unauthorized: you don't own this form")
	}

	return s.formRepo.DeleteSubmission(submissionID)
}

// Helper functions

func (s *formService) toFormResponse(form *domain.Form) *dto.FormResponse {
	return &dto.FormResponse{
		ID:          form.ID.Hex(),
		OwnerID:     form.OwnerID.Hex(),
		Title:       form.Title,
		Description: form.Description,
		Fields:      form.Fields,
		Settings:    form.Settings,
		Theme:       form.Theme,
		Slug:        form.Slug,
		ViewCount:   form.ViewCount,
		SubmitCount: form.SubmitCount,
		CreatedAt:   form.CreatedAt,
		UpdatedAt:   form.UpdatedAt,
	}
}

func (s *formService) toPublicFormResponse(form *domain.Form) *dto.PublicFormResponse {
	return &dto.PublicFormResponse{
		ID:          form.ID.Hex(),
		Title:       form.Title,
		Description: form.Description,
		Fields:      form.Fields,
		Settings: dto.PublicFormSettings{
			AcceptResponses:      form.Settings.AcceptResponses,
			AllowMultipleSubmits: form.Settings.AllowMultipleSubmits,
			RequireLogin:         form.Settings.RequireLogin,
			ShowProgressBar:      form.Settings.ShowProgressBar,
			ConfirmationMessage:  form.Settings.ConfirmationMessage,
			ClosedMessage:        form.Settings.ClosedMessage,
		},
		Theme: form.Theme,
		Slug:  form.Slug,
	}
}

func (s *formService) toFormListResponse(form *domain.Form) *dto.FormListResponse {
	return &dto.FormListResponse{
		ID:          form.ID.Hex(),
		Title:       form.Title,
		Description: form.Description,
		Slug:        form.Slug,
		IsPublished: form.Settings.IsPublished,
		ViewCount:   form.ViewCount,
		SubmitCount: form.SubmitCount,
		CreatedAt:   form.CreatedAt,
		UpdatedAt:   form.UpdatedAt,
	}
}

func (s *formService) toSubmissionResponse(submission *domain.FormSubmission) *dto.SubmissionResponse {
	var userID *string
	if submission.UserID != nil {
		uid := submission.UserID.Hex()
		userID = &uid
	}

	return &dto.SubmissionResponse{
		ID:          submission.ID.Hex(),
		FormID:      submission.FormID.Hex(),
		UserID:      userID,
		Responses:   submission.Responses,
		SubmittedAt: submission.SubmittedAt,
	}
}

func generateSlug(title string) string {
	// Convert to lowercase
	slug := strings.ToLower(title)

	// Replace spaces with hyphens
	slug = strings.ReplaceAll(slug, " ", "-")

	// Remove special characters
	reg := regexp.MustCompile("[^a-z0-9-]+")
	slug = reg.ReplaceAllString(slug, "")

	// Remove consecutive hyphens
	reg = regexp.MustCompile("-+")
	slug = reg.ReplaceAllString(slug, "-")

	// Trim hyphens from start and end
	slug = strings.Trim(slug, "-")

	// Limit length
	if len(slug) > 50 {
		slug = slug[:50]
	}

	return slug
}
