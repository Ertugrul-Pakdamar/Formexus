package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// FieldType represents the type of a form field
type FieldType string

const (
	FieldTypeShortText    FieldType = "short_text"
	FieldTypeLongText     FieldType = "long_text"
	FieldTypeEmail        FieldType = "email"
	FieldTypeNumber       FieldType = "number"
	FieldTypePhone        FieldType = "phone"
	FieldTypeURL          FieldType = "url"
	FieldTypeDate         FieldType = "date"
	FieldTypeTime         FieldType = "time"
	FieldTypeDateTime     FieldType = "datetime"
	FieldTypeSingleChoice FieldType = "single_choice" // Radio buttons
	FieldTypeMultiChoice  FieldType = "multi_choice"  // Checkboxes
	FieldTypeDropdown     FieldType = "dropdown"
	FieldTypeLinearScale  FieldType = "linear_scale"
	FieldTypeRating       FieldType = "rating"
	FieldTypeFileUpload   FieldType = "file_upload"
	FieldTypeMatrix       FieldType = "matrix"
	FieldTypeSection      FieldType = "section" // Section divider/header
)

// FormField represents a field in the form
type FormField struct {
	ID          string    `json:"id" bson:"id"`
	Type        FieldType `json:"type" bson:"type"`
	Label       string    `json:"label" bson:"label"`
	Description string    `json:"description,omitempty" bson:"description,omitempty"`
	Required    bool      `json:"required" bson:"required"`
	Order       int       `json:"order" bson:"order"`

	// Field-specific options
	Options     []string `json:"options,omitempty" bson:"options,omitempty"`         // For choice fields
	MinValue    *int     `json:"minValue,omitempty" bson:"minValue,omitempty"`       // For number, scale
	MaxValue    *int     `json:"maxValue,omitempty" bson:"maxValue,omitempty"`       // For number, scale
	MinLength   *int     `json:"minLength,omitempty" bson:"minLength,omitempty"`     // For text
	MaxLength   *int     `json:"maxLength,omitempty" bson:"maxLength,omitempty"`     // For text
	Pattern     string   `json:"pattern,omitempty" bson:"pattern,omitempty"`         // Regex validation
	Placeholder string   `json:"placeholder,omitempty" bson:"placeholder,omitempty"` // Input placeholder

	// Matrix-specific
	Rows    []string `json:"rows,omitempty" bson:"rows,omitempty"`       // Matrix rows
	Columns []string `json:"columns,omitempty" bson:"columns,omitempty"` // Matrix columns

	// File upload specific
	AcceptedFileTypes []string `json:"acceptedFileTypes,omitempty" bson:"acceptedFileTypes,omitempty"`
	MaxFileSize       *int     `json:"maxFileSize,omitempty" bson:"maxFileSize,omitempty"` // In bytes

	// Conditional logic
	ShowIf *ConditionalLogic `json:"showIf,omitempty" bson:"showIf,omitempty"`

	// Custom properties for future extensibility
	CustomProps map[string]interface{} `json:"customProps,omitempty" bson:"customProps,omitempty"`
}

// ConditionalLogic defines when a field should be shown
type ConditionalLogic struct {
	FieldID  string      `json:"fieldId" bson:"fieldId"`
	Operator string      `json:"operator" bson:"operator"` // equals, contains, greaterThan, etc.
	Value    interface{} `json:"value" bson:"value"`
}

// FormSettings contains form-level settings
type FormSettings struct {
	IsPublished          bool       `json:"isPublished" bson:"isPublished"`
	AcceptResponses      bool       `json:"acceptResponses" bson:"acceptResponses"`
	AllowMultipleSubmits bool       `json:"allowMultipleSubmits" bson:"allowMultipleSubmits"`
	RequireLogin         bool       `json:"requireLogin" bson:"requireLogin"`
	ShowProgressBar      bool       `json:"showProgressBar" bson:"showProgressBar"`
	ShuffleQuestions     bool       `json:"shuffleQuestions" bson:"shuffleQuestions"`
	ConfirmationMessage  string     `json:"confirmationMessage,omitempty" bson:"confirmationMessage,omitempty"`
	RedirectURL          string     `json:"redirectUrl,omitempty" bson:"redirectUrl,omitempty"`
	NotificationEmails   []string   `json:"notificationEmails,omitempty" bson:"notificationEmails,omitempty"`
	ClosedMessage        string     `json:"closedMessage,omitempty" bson:"closedMessage,omitempty"`
	StartDate            *time.Time `json:"startDate,omitempty" bson:"startDate,omitempty"`
	EndDate              *time.Time `json:"endDate,omitempty" bson:"endDate,omitempty"`
}

// FormTheme contains visual customization
type FormTheme struct {
	PrimaryColor    string `json:"primaryColor,omitempty" bson:"primaryColor,omitempty"`
	BackgroundColor string `json:"backgroundColor,omitempty" bson:"backgroundColor,omitempty"`
	FontFamily      string `json:"fontFamily,omitempty" bson:"fontFamily,omitempty"`
	BackgroundImage string `json:"backgroundImage,omitempty" bson:"backgroundImage,omitempty"`
	LogoURL         string `json:"logoUrl,omitempty" bson:"logoUrl,omitempty"`
}

// Form represents a form document
type Form struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	OwnerID     primitive.ObjectID `json:"ownerId" bson:"ownerId"`
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description,omitempty" bson:"description,omitempty"`
	Fields      []FormField        `json:"fields" bson:"fields"`
	Settings    FormSettings       `json:"settings" bson:"settings"`
	Theme       FormTheme          `json:"theme,omitempty" bson:"theme,omitempty"`

	// Metadata
	Slug        string `json:"slug" bson:"slug"` // URL-friendly identifier
	ViewCount   int    `json:"viewCount" bson:"viewCount"`
	SubmitCount int    `json:"submitCount" bson:"submitCount"`

	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}

// FormSubmission represents a user's submission to a form
type FormSubmission struct {
	ID          primitive.ObjectID     `json:"id" bson:"_id,omitempty"`
	FormID      primitive.ObjectID     `json:"formId" bson:"formId"`
	UserID      *primitive.ObjectID    `json:"userId,omitempty" bson:"userId,omitempty"` // Null if anonymous
	Responses   map[string]interface{} `json:"responses" bson:"responses"`               // fieldId -> value
	IPAddress   string                 `json:"ipAddress,omitempty" bson:"ipAddress,omitempty"`
	UserAgent   string                 `json:"userAgent,omitempty" bson:"userAgent,omitempty"`
	SubmittedAt time.Time              `json:"submittedAt" bson:"submittedAt"`
}

// FormRepository defines the interface for form data operations
type FormRepository interface {
	Create(form *Form) error
	FindByID(id primitive.ObjectID) (*Form, error)
	FindBySlug(slug string) (*Form, error)
	FindByOwnerID(ownerID primitive.ObjectID) ([]*Form, error)
	Update(form *Form) error
	Delete(id primitive.ObjectID) error
	IncrementViewCount(id primitive.ObjectID) error
	IncrementSubmitCount(id primitive.ObjectID) error

	// Submission methods
	CreateSubmission(submission *FormSubmission) error
	FindSubmissionsByFormID(formID primitive.ObjectID) ([]*FormSubmission, error)
	FindSubmissionByID(id primitive.ObjectID) (*FormSubmission, error)
	DeleteSubmission(id primitive.ObjectID) error
}
