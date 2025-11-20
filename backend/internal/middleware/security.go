package middleware

import (
	"github.com/gofiber/fiber/v2"
)

// SecurityHeaders adds security headers to all responses
func SecurityHeaders() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Prevent XSS attacks
		c.Set("X-XSS-Protection", "1; mode=block")

		// Prevent clickjacking
		c.Set("X-Frame-Options", "DENY")

		// Prevent MIME type sniffing
		c.Set("X-Content-Type-Options", "nosniff")

		// Referrer policy
		c.Set("Referrer-Policy", "strict-origin-when-cross-origin")

		// Content Security Policy
		c.Set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;")

		// Remove Server header
		c.Set("Server", "")

		return c.Next()
	}
}

// RateLimitConfig represents rate limiting configuration
type RateLimitConfig struct {
	Max        int    // Maximum number of requests
	Expiration int    // Time window in seconds
	Message    string // Error message
}

// Note: For production, use a proper rate limiting middleware like:
// github.com/gofiber/fiber/v2/middleware/limiter
