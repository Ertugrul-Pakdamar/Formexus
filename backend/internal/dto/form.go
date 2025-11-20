package dto

import (
	"time"

	"github.com/formexus/backend/internal/domain"
)

// CreateFormRequest represents a request to create a new form
type CreateFormRequest struct {
	Title       string               `json:"title" validate:"required,min=1,max=200"`
	Description string               `json:"description,omitempty" validate:"max=1000"`
	Fields      []domain.FormField   `json:"fields,omitempty"`
	Settings    *domain.FormSettings `json:"settings,omitempty"`
	Theme       *domain.FormTheme    `json:"theme,omitempty"`
}

// UpdateFormRequest represents a request to update an existing form
type UpdateFormRequest struct {
	Title       *string              `json:"title,omitempty" validate:"omitempty,min=1,max=200"`
	Description *string              `json:"description,omitempty" validate:"omitempty,max=1000"`
	Fields      []domain.FormField   `json:"fields,omitempty"`
	Settings    *domain.FormSettings `json:"settings,omitempty"`
	Theme       *domain.FormTheme    `json:"theme,omitempty"`
}

// FormResponse represents a form in API responses
type FormResponse struct {
	ID          string              `json:"id"`
	OwnerID     string              `json:"ownerId"`
	Title       string              `json:"title"`
	Description string              `json:"description,omitempty"`
	Fields      []domain.FormField  `json:"fields"`
	Settings    domain.FormSettings `json:"settings"`
	Theme       domain.FormTheme    `json:"theme"`
	Slug        string              `json:"slug"`
	ViewCount   int                 `json:"viewCount"`
	SubmitCount int                 `json:"submitCount"`
	CreatedAt   time.Time           `json:"createdAt"`
	UpdatedAt   time.Time           `json:"updatedAt"`
}

// PublicFormResponse represents a form for public viewing (without sensitive data)
type PublicFormResponse struct {
	ID          string             `json:"id"`
	Title       string             `json:"title"`
	Description string             `json:"description,omitempty"`
	Fields      []domain.FormField `json:"fields"`
	Settings    PublicFormSettings `json:"settings"`
	Theme       domain.FormTheme   `json:"theme"`
	Slug        string             `json:"slug"`
}

// PublicFormSettings contains only public-facing settings
type PublicFormSettings struct {
	AcceptResponses      bool   `json:"acceptResponses"`
	AllowMultipleSubmits bool   `json:"allowMultipleSubmits"`
	RequireLogin         bool   `json:"requireLogin"`
	ShowProgressBar      bool   `json:"showProgressBar"`
	ConfirmationMessage  string `json:"confirmationMessage,omitempty"`
	ClosedMessage        string `json:"closedMessage,omitempty"`
}

// FormListResponse represents a simplified form for listing
type FormListResponse struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	Slug        string    `json:"slug"`
	IsPublished bool      `json:"isPublished"`
	ViewCount   int       `json:"viewCount"`
	SubmitCount int       `json:"submitCount"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// SubmitFormRequest represents a form submission
type SubmitFormRequest struct {
	Responses map[string]interface{} `json:"responses" validate:"required"`
}

// SubmissionResponse represents a submission in API responses
type SubmissionResponse struct {
	ID          string                 `json:"id"`
	FormID      string                 `json:"formId"`
	UserID      *string                `json:"userId,omitempty"`
	Responses   map[string]interface{} `json:"responses"`
	SubmittedAt time.Time              `json:"submittedAt"`
}

// FormStatsResponse represents form statistics
type FormStatsResponse struct {
	FormID         string               `json:"formId"`
	ViewCount      int                  `json:"viewCount"`
	SubmitCount    int                  `json:"submitCount"`
	CompletionRate float64              `json:"completionRate"` // submitCount / viewCount
	LastSubmission *time.Time           `json:"lastSubmission,omitempty"`
	FieldStats     []FieldStatsResponse `json:"fieldStats,omitempty"`
}

// FieldStatsResponse represents statistics for a specific field
type FieldStatsResponse struct {
	FieldID           string         `json:"fieldId"`
	FieldLabel        string         `json:"fieldLabel"`
	ResponseCount     int            `json:"responseCount"`
	ValueDistribution map[string]int `json:"valueDistribution,omitempty"` // For choice fields
}

// DuplicateFormRequest represents a request to duplicate a form
type DuplicateFormRequest struct {
	Title string `json:"title,omitempty" validate:"omitempty,min=1,max=200"`
}
