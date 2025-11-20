package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents a user in the system
type User struct {
	ID        primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Email     string               `json:"email" bson:"email"`
	Password  string               `json:"-" bson:"password"` // Never expose password in JSON
	Name      string               `json:"name" bson:"name"`
	Forms     []primitive.ObjectID `json:"forms" bson:"forms"`
	Provider  string               `json:"provider" bson:"provider"` // "local" or "google"
	GoogleID  string               `json:"googleId,omitempty" bson:"googleId,omitempty"`
	CreatedAt time.Time            `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time            `json:"updatedAt" bson:"updatedAt"`
}

// UserRepository defines the interface for user data operations
type UserRepository interface {
	Create(user *User) error
	FindByID(id primitive.ObjectID) (*User, error)
	FindByEmail(email string) (*User, error)
	FindByGoogleID(googleID string) (*User, error)
	Update(user *User) error
	Delete(id primitive.ObjectID) error
}
