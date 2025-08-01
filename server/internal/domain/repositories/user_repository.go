package repositories

import (
	"context"
	"whisper-server/internal/domain/entities"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserRepository interface {
	// Create user
	Create(ctx context.Context, user *entities.User) error
	
	// Find operations
	FindByID(ctx context.Context, id primitive.ObjectID) (*entities.User, error)
	FindByUsername(ctx context.Context, username string) (*entities.User, error)
	FindByEmail(ctx context.Context, email string) (*entities.User, error)
	
	// Update operations
	Update(ctx context.Context, user *entities.User) error
	UpdatePassword(ctx context.Context, userID primitive.ObjectID, hashedPassword string) error
	
	// Check existence
	ExistsByUsername(ctx context.Context, username string) (bool, error)
	ExistsByEmail(ctx context.Context, email string) (bool, error)
	
	// Soft delete
	Delete(ctx context.Context, id primitive.ObjectID) error
}