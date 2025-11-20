package handler

import (
	"context"
	"log"
	"strings"

	"github.com/formexus/backend/internal/dto"
	"github.com/formexus/backend/internal/service"
	"github.com/gofiber/fiber/v2"
	"google.golang.org/api/oauth2/v2"
)

type AuthHandler struct {
	authService service.AuthService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Register handles user registration
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req dto.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid request body",
			Message: err.Error(),
		})
	}

	// Log incoming request
	log.Printf("Register request: email=%s, name=%s", req.Email, req.Name)

	// Validate request
	if err := validateRegisterRequest(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Validation failed",
			Message: err.Error(),
		})
	}

	// Register user
	resp, err := h.authService.Register(&req)
	if err != nil {
		log.Printf("Registration error: %v", err)
		if strings.Contains(err.Error(), "already exists") {
			return c.Status(fiber.StatusConflict).JSON(dto.ErrorResponse{
				Error:   "User already exists",
				Message: err.Error(),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Registration failed",
			Message: err.Error(),
		})
	}

	log.Printf("User registered successfully: %s", req.Email)
	return c.Status(fiber.StatusCreated).JSON(resp)
}

// Login handles user login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid request body",
			Message: err.Error(),
		})
	}

	// Validate request
	if err := validateLoginRequest(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Validation failed",
			Message: err.Error(),
		})
	}

	// Login user
	resp, err := h.authService.Login(&req)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(dto.ErrorResponse{
			Error:   "Authentication failed",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

// GoogleAuth handles Google OAuth authentication
func (h *AuthHandler) GoogleAuth(c *fiber.Ctx) error {
	var req dto.GoogleAuthRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Invalid request body",
			Message: err.Error(),
		})
	}

	// Verify Google token
	ctx := context.Background()
	oauth2Service, err := oauth2.NewService(ctx)
	if err != nil {
		log.Printf("Failed to create oauth2 service: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Failed to verify token",
			Message: "Internal server error",
		})
	}

	tokenInfo, err := oauth2Service.Tokeninfo().IdToken(req.Token).Do()
	if err != nil {
		log.Printf("Failed to verify Google token: %v", err)
		return c.Status(fiber.StatusUnauthorized).JSON(dto.ErrorResponse{
			Error:   "Invalid token",
			Message: "Failed to verify Google token",
		})
	}

	// Extract user info from token
	googleID := tokenInfo.UserId
	email := tokenInfo.Email
	name := tokenInfo.Email // Default to email

	// Try to extract name from email
	if tokenInfo.Email != "" {
		parts := strings.Split(tokenInfo.Email, "@")
		if len(parts) > 0 {
			name = parts[0]
		}
	}

	// Authenticate user
	resp, err := h.authService.GoogleAuth(googleID, email, name)
	if err != nil {
		log.Printf("Google auth error: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Authentication failed",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

// GetMe returns current user info
func (h *AuthHandler) GetMe(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	// TODO: Get user from database using userID
	// For now, return basic info

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"userId": userID,
	})
}

// Validation helpers
func validateRegisterRequest(req *dto.RegisterRequest) error {
	if req.Email == "" || !strings.Contains(req.Email, "@") {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid email address")
	}
	if len(req.Password) < 8 {
		return fiber.NewError(fiber.StatusBadRequest, "Password must be at least 8 characters")
	}
	if req.Password != req.ConfirmPassword {
		return fiber.NewError(fiber.StatusBadRequest, "Passwords do not match")
	}
	if len(req.Name) < 2 {
		return fiber.NewError(fiber.StatusBadRequest, "Name must be at least 2 characters")
	}
	return nil
}

func validateLoginRequest(req *dto.LoginRequest) error {
	if req.Email == "" || !strings.Contains(req.Email, "@") {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid email address")
	}
	if req.Password == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Password is required")
	}
	return nil
}
