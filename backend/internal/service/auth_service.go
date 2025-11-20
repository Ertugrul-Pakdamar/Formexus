package service

import (
	"fmt"

	"github.com/formexus/backend/internal/config"
	"github.com/formexus/backend/internal/domain"
	"github.com/formexus/backend/internal/dto"
	"github.com/formexus/backend/pkg/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AuthService interface {
	Register(req *dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(req *dto.LoginRequest) (*dto.AuthResponse, error)
	GoogleAuth(googleID, email, name string) (*dto.AuthResponse, error)
	GetUserByID(id primitive.ObjectID) (*domain.User, error)
}

type authService struct {
	userRepo domain.UserRepository
	config   *config.Config
}

// NewAuthService creates a new authentication service
func NewAuthService(userRepo domain.UserRepository, cfg *config.Config) AuthService {
	return &authService{
		userRepo: userRepo,
		config:   cfg,
	}
}

func (s *authService) Register(req *dto.RegisterRequest) (*dto.AuthResponse, error) {
	// Check if user already exists
	existingUser, _ := s.userRepo.FindByEmail(req.Email)
	if existingUser != nil {
		return nil, fmt.Errorf("user with this email already exists")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &domain.User{
		Email:    req.Email,
		Password: hashedPassword,
		Name:     req.Name,
		Provider: "local",
		Forms:    []primitive.ObjectID{},
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Generate token
	token, err := utils.GenerateToken(user, s.config)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User: &dto.UserInfo{
			ID:    user.ID.Hex(),
			Email: user.Email,
			Name:  user.Name,
		},
	}, nil
}

func (s *authService) Login(req *dto.LoginRequest) (*dto.AuthResponse, error) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	// Check if user registered with Google
	if user.Provider == "google" {
		return nil, fmt.Errorf("please sign in with Google")
	}

	// Verify password
	if err := utils.ComparePassword(user.Password, req.Password); err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	// Generate token
	token, err := utils.GenerateToken(user, s.config)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User: &dto.UserInfo{
			ID:    user.ID.Hex(),
			Email: user.Email,
			Name:  user.Name,
		},
	}, nil
}

func (s *authService) GoogleAuth(googleID, email, name string) (*dto.AuthResponse, error) {
	// Try to find user by Google ID
	user, err := s.userRepo.FindByGoogleID(googleID)

	// If user not found by Google ID, try by email
	if err != nil {
		user, err = s.userRepo.FindByEmail(email)
		if err != nil {
			// Create new user
			user = &domain.User{
				Email:    email,
				Name:     name,
				GoogleID: googleID,
				Provider: "google",
				Forms:    []primitive.ObjectID{},
			}

			if err := s.userRepo.Create(user); err != nil {
				return nil, fmt.Errorf("failed to create user: %w", err)
			}
		} else {
			// Update existing user with Google ID
			user.GoogleID = googleID
			if user.Provider != "google" {
				user.Provider = "google"
			}
			if err := s.userRepo.Update(user); err != nil {
				return nil, fmt.Errorf("failed to update user: %w", err)
			}
		}
	}

	// Generate token
	token, err := utils.GenerateToken(user, s.config)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User: &dto.UserInfo{
			ID:    user.ID.Hex(),
			Email: user.Email,
			Name:  user.Name,
		},
	}, nil
}

func (s *authService) GetUserByID(id primitive.ObjectID) (*domain.User, error) {
	return s.userRepo.FindByID(id)
}
