package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/formexus/backend/internal/config"
	"github.com/formexus/backend/internal/database"
	"github.com/formexus/backend/internal/handler"
	"github.com/formexus/backend/internal/middleware"
	"github.com/formexus/backend/internal/repository"
	"github.com/formexus/backend/internal/service"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// Load configuration
	cfg := config.Load()
	log.Printf("🚀 Starting Formexus Backend (Environment: %s)", cfg.Server.Env)

	// Connect to MongoDB
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Disconnect()

	// Initialize repositories
	userRepo := repository.NewUserRepository(db.Database)
	formRepo := repository.NewFormRepository(db.Database)

	// Initialize services
	authService := service.NewAuthService(userRepo, cfg)
	formService := service.NewFormService(formRepo, userRepo)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	formHandler := handler.NewFormHandler(formService)

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.ErrorHandler(),
		AppName:      "Formexus API",
	})

	// Global middleware
	app.Use(recover.New())
	app.Use(middleware.Logger())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORS.AllowedOrigins[0],
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true,
	}))

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "formexus-api",
		})
	})

	// API routes
	api := app.Group("/api")

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/google", authHandler.GoogleAuth)

	// Public form routes (no authentication required)
	forms := api.Group("/forms")
	forms.Get("/:slug", formHandler.GetPublicForm)      // View form
	forms.Post("/:slug/submit", formHandler.SubmitForm) // Submit form

	// Protected routes (authentication required)
	protected := api.Group("/", middleware.AuthMiddleware(cfg))
	protected.Get("/me", authHandler.GetMe)

	// Protected form routes
	protected.Post("/forms", formHandler.CreateForm)                             // Create form
	protected.Get("/forms", formHandler.GetUserForms)                            // List user's forms
	protected.Get("/forms/id/:id", formHandler.GetForm)                          // Get specific form
	protected.Put("/forms/:id", formHandler.UpdateForm)                          // Update form
	protected.Delete("/forms/:id", formHandler.DeleteForm)                       // Delete form
	protected.Post("/forms/:id/duplicate", formHandler.DuplicateForm)            // Duplicate form
	protected.Get("/forms/:id/submissions", formHandler.GetFormSubmissions)      // Get submissions
	protected.Get("/forms/:id/stats", formHandler.GetFormStats)                  // Get stats
	protected.Delete("/submissions/:submissionId", formHandler.DeleteSubmission) // Delete submission

	// Start server
	port := fmt.Sprintf(":%s", cfg.Server.Port)
	go func() {
		if err := app.Listen(port); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	log.Printf("✅ Server started on port %s", cfg.Server.Port)

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down server...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("👋 Server stopped gracefully")
}
