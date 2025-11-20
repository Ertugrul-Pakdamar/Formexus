package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/formexus/backend/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type formRepository struct {
	formsCollection       *mongo.Collection
	submissionsCollection *mongo.Collection
}

// NewFormRepository creates a new form repository instance
func NewFormRepository(db *mongo.Database) domain.FormRepository {
	return &formRepository{
		formsCollection:       db.Collection("forms"),
		submissionsCollection: db.Collection("form_submissions"),
	}
}

func (r *formRepository) Create(form *domain.Form) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	form.CreatedAt = time.Now()
	form.UpdatedAt = time.Now()
	form.ViewCount = 0
	form.SubmitCount = 0

	// Initialize default settings if not provided
	if !form.Settings.IsPublished {
		form.Settings.AcceptResponses = true
	}

	result, err := r.formsCollection.InsertOne(ctx, form)
	if err != nil {
		return fmt.Errorf("failed to create form: %w", err)
	}

	form.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *formRepository) FindByID(id primitive.ObjectID) (*domain.Form, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var form domain.Form
	err := r.formsCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&form)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("form not found")
		}
		return nil, fmt.Errorf("failed to find form: %w", err)
	}

	return &form, nil
}

func (r *formRepository) FindBySlug(slug string) (*domain.Form, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var form domain.Form
	err := r.formsCollection.FindOne(ctx, bson.M{"slug": slug}).Decode(&form)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("form not found")
		}
		return nil, fmt.Errorf("failed to find form: %w", err)
	}

	return &form, nil
}

func (r *formRepository) FindByOwnerID(ownerID primitive.ObjectID) ([]*domain.Form, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := r.formsCollection.Find(ctx, bson.M{"ownerId": ownerID}, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to find forms: %w", err)
	}
	defer cursor.Close(ctx)

	var forms []*domain.Form
	if err = cursor.All(ctx, &forms); err != nil {
		return nil, fmt.Errorf("failed to decode forms: %w", err)
	}

	return forms, nil
}

func (r *formRepository) Update(form *domain.Form) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	form.UpdatedAt = time.Now()

	filter := bson.M{"_id": form.ID}
	update := bson.M{"$set": form}

	result, err := r.formsCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to update form: %w", err)
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("form not found")
	}

	return nil
}

func (r *formRepository) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := r.formsCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("failed to delete form: %w", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("form not found")
	}

	// Also delete all submissions for this form
	_, _ = r.submissionsCollection.DeleteMany(ctx, bson.M{"formId": id})

	return nil
}

func (r *formRepository) IncrementViewCount(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": id}
	update := bson.M{"$inc": bson.M{"viewCount": 1}}

	_, err := r.formsCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to increment view count: %w", err)
	}

	return nil
}

func (r *formRepository) IncrementSubmitCount(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": id}
	update := bson.M{"$inc": bson.M{"submitCount": 1}}

	_, err := r.formsCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to increment submit count: %w", err)
	}

	return nil
}

// Submission methods

func (r *formRepository) CreateSubmission(submission *domain.FormSubmission) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	submission.SubmittedAt = time.Now()

	result, err := r.submissionsCollection.InsertOne(ctx, submission)
	if err != nil {
		return fmt.Errorf("failed to create submission: %w", err)
	}

	submission.ID = result.InsertedID.(primitive.ObjectID)

	// Increment form submit count
	if err := r.IncrementSubmitCount(submission.FormID); err != nil {
		// Log error but don't fail the submission
		fmt.Printf("Warning: failed to increment submit count: %v\n", err)
	}

	return nil
}

func (r *formRepository) FindSubmissionsByFormID(formID primitive.ObjectID) ([]*domain.FormSubmission, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "submittedAt", Value: -1}})
	cursor, err := r.submissionsCollection.Find(ctx, bson.M{"formId": formID}, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to find submissions: %w", err)
	}
	defer cursor.Close(ctx)

	var submissions []*domain.FormSubmission
	if err = cursor.All(ctx, &submissions); err != nil {
		return nil, fmt.Errorf("failed to decode submissions: %w", err)
	}

	return submissions, nil
}

func (r *formRepository) FindSubmissionByID(id primitive.ObjectID) (*domain.FormSubmission, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var submission domain.FormSubmission
	err := r.submissionsCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&submission)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("submission not found")
		}
		return nil, fmt.Errorf("failed to find submission: %w", err)
	}

	return &submission, nil
}

func (r *formRepository) DeleteSubmission(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := r.submissionsCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("failed to delete submission: %w", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("submission not found")
	}

	return nil
}
