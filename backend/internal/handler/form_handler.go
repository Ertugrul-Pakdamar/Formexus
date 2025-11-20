package handler

import (
	"log"

	"github.com/formexus/backend/internal/dto"
	"github.com/formexus/backend/internal/service"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FormHandler struct {
	formService service.FormService
}

func NewFormHandler(formService service.FormService) *FormHandler {
	return &FormHandler{
		formService: formService,
	}
}

// CreateForm handles form creation (protected)
func (h *FormHandler) CreateForm(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	ownerID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid user ID",
			Message: err.Error(),
		})
	}

	var req dto.CreateFormRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid request body",
			Message: err.Error(),
		})
	}

	log.Printf("Creating form: %s by user %s", req.Title, userID)

	form, err := h.formService.CreateForm(ownerID, &req)
	if err != nil {
		log.Printf("Error creating form: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Failed to create form",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(form)
}

// GetUserForms returns all forms owned by the current user (protected)
func (h *FormHandler) GetUserForms(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	ownerID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid user ID",
			Message: err.Error(),
		})
	}

	forms, err := h.formService.GetUserForms(ownerID)
	if err != nil {
		log.Printf("Error getting user forms: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Failed to get forms",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"forms": forms,
	})
}

// GetForm returns a specific form by ID (protected)
func (h *FormHandler) GetForm(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	formIDStr := c.Params("id")

	formID, err := primitive.ObjectIDFromHex(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid form ID",
			Message: err.Error(),
		})
	}

	form, err := h.formService.GetForm(formID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Error:   "Form not found",
			Message: err.Error(),
		})
	}

	// Verify ownership
	if form.OwnerID != userID {
		return c.Status(fiber.StatusForbidden).JSON(dto.ErrorResponse{
			Error:   "Forbidden",
			Message: "You don't have access to this form",
		})
	}

	return c.Status(fiber.StatusOK).JSON(form)
}

// UpdateForm updates a form (protected)
func (h *FormHandler) UpdateForm(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	ownerID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid user ID",
			Message: err.Error(),
		})
	}

	formIDStr := c.Params("id")
	formID, err := primitive.ObjectIDFromHex(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid form ID",
			Message: err.Error(),
		})
	}

	var req dto.UpdateFormRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid request body",
			Message: err.Error(),
		})
	}

	form, err := h.formService.UpdateForm(formID, ownerID, &req)
	if err != nil {
		log.Printf("Error updating form: %v", err)
		if err.Error() == "unauthorized: you don't own this form" {
			return c.Status(fiber.StatusForbidden).JSON(dto.ErrorResponse{
				Error:   "Forbidden",
				Message: err.Error(),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Failed to update form",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(form)
}

// DeleteForm deletes a form (protected)
func (h *FormHandler) DeleteForm(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	ownerID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid user ID",
			Message: err.Error(),
		})
	}

	formIDStr := c.Params("id")
	formID, err := primitive.ObjectIDFromHex(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid form ID",
			Message: err.Error(),
		})
	}

	err = h.formService.DeleteForm(formID, ownerID)
	if err != nil {
		log.Printf("Error deleting form: %v", err)
		if err.Error() == "unauthorized: you don't own this form" {
			return c.Status(fiber.StatusForbidden).JSON(dto.ErrorResponse{
				Error:   "Forbidden",
				Message: err.Error(),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Failed to delete form",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Form deleted successfully",
	})
}

// DuplicateForm duplicates a form (protected)
func (h *FormHandler) DuplicateForm(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	ownerID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid user ID",
			Message: err.Error(),
		})
	}

	formIDStr := c.Params("id")
	formID, err := primitive.ObjectIDFromHex(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid form ID",
			Message: err.Error(),
		})
	}

	var req dto.DuplicateFormRequest
	_ = c.BodyParser(&req) // Optional body

	form, err := h.formService.DuplicateForm(formID, ownerID, &req)
	if err != nil {
		log.Printf("Error duplicating form: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Failed to duplicate form",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(form)
}

// GetPublicForm returns a form for public viewing (no auth required)
func (h *FormHandler) GetPublicForm(c *fiber.Ctx) error {
	slug := c.Params("slug")

	form, err := h.formService.GetPublicForm(slug)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Error:   "Form not found or not available",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(form)
}

// SubmitForm handles form submission (no auth required, but can be authenticated)
func (h *FormHandler) SubmitForm(c *fiber.Ctx) error {
	slug := c.Params("slug")

	var req dto.SubmitFormRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid request body",
			Message: err.Error(),
		})
	}

	// Try to get user ID if authenticated (optional)
	var userID *primitive.ObjectID
	if userIDStr, ok := c.Locals("userId").(string); ok && userIDStr != "" {
		if oid, err := primitive.ObjectIDFromHex(userIDStr); err == nil {
			userID = &oid
		}
	}

	// Get IP and user agent
	ipAddress := c.IP()
	userAgent := c.Get("User-Agent")

	submission, err := h.formService.SubmitForm(slug, &req, userID, ipAddress, userAgent)
	if err != nil {
		log.Printf("Error submitting form: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Failed to submit form",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(submission)
}

// GetFormSubmissions returns all submissions for a form (protected)
func (h *FormHandler) GetFormSubmissions(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	ownerID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid user ID",
			Message: err.Error(),
		})
	}

	formIDStr := c.Params("id")
	formID, err := primitive.ObjectIDFromHex(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid form ID",
			Message: err.Error(),
		})
	}

	submissions, err := h.formService.GetFormSubmissions(formID, ownerID)
	if err != nil {
		log.Printf("Error getting submissions: %v", err)
		if err.Error() == "unauthorized: you don't own this form" {
			return c.Status(fiber.StatusForbidden).JSON(dto.ErrorResponse{
				Error:   "Forbidden",
				Message: err.Error(),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Failed to get submissions",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"submissions": submissions,
	})
}

// GetFormStats returns statistics for a form (protected)
func (h *FormHandler) GetFormStats(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	ownerID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid user ID",
			Message: err.Error(),
		})
	}

	formIDStr := c.Params("id")
	formID, err := primitive.ObjectIDFromHex(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid form ID",
			Message: err.Error(),
		})
	}

	stats, err := h.formService.GetFormStats(formID, ownerID)
	if err != nil {
		log.Printf("Error getting stats: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Failed to get stats",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(stats)
}

// DeleteSubmission deletes a submission (protected)
func (h *FormHandler) DeleteSubmission(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	ownerID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid user ID",
			Message: err.Error(),
		})
	}

	submissionIDStr := c.Params("submissionId")
	submissionID, err := primitive.ObjectIDFromHex(submissionIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid submission ID",
			Message: err.Error(),
		})
	}

	err = h.formService.DeleteSubmission(submissionID, ownerID)
	if err != nil {
		log.Printf("Error deleting submission: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Failed to delete submission",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Submission deleted successfully",
	})
}
