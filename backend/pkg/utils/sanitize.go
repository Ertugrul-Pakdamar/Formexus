package utils

import (
	"html"
	"regexp"
	"strings"
)

// SanitizeInput removes potentially dangerous HTML/JavaScript from user input
func SanitizeInput(input string) string {
	// HTML escape
	sanitized := html.EscapeString(input)

	// Remove potential script tags (case-insensitive)
	scriptTagRegex := regexp.MustCompile(`(?i)<script[^>]*>.*?</script>`)
	sanitized = scriptTagRegex.ReplaceAllString(sanitized, "")

	// Remove event handlers (onclick, onerror, etc.)
	eventHandlerRegex := regexp.MustCompile(`(?i)on\w+\s*=`)
	sanitized = eventHandlerRegex.ReplaceAllString(sanitized, "")

	// Remove javascript: protocol
	sanitized = strings.ReplaceAll(sanitized, "javascript:", "")

	// Trim whitespace
	sanitized = strings.TrimSpace(sanitized)

	return sanitized
}

// SanitizeEmail validates and sanitizes email addresses
func SanitizeEmail(email string) string {
	email = strings.TrimSpace(email)
	email = strings.ToLower(email)
	return html.EscapeString(email)
}

// ValidateName checks if name contains only allowed characters
func ValidateName(name string) bool {
	// Allow letters, spaces, hyphens, apostrophes
	nameRegex := regexp.MustCompile(`^[a-zA-ZÀ-ÿ\s'-]+$`)
	return nameRegex.MatchString(name)
}
