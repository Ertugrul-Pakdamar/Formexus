package middleware

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

// ErrorHandler is a custom error handling middleware
func ErrorHandler() fiber.ErrorHandler {
	return func(c *fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError

		if e, ok := err.(*fiber.Error); ok {
			code = e.Code
		}

		log.Printf("Error: %v", err)

		return c.Status(code).JSON(fiber.Map{
			"error":   err.Error(),
			"message": "An error occurred processing your request",
		})
	}
}
