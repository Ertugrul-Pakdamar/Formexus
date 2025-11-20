package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

// Logger is a custom logging middleware
func Logger() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		// Process request
		err := c.Next()

		// Log request details
		duration := time.Since(start)
		status := c.Response().StatusCode()

		log.Printf(
			"%s %s - %d - %v",
			c.Method(),
			c.Path(),
			status,
			duration,
		)

		return err
	}
}
