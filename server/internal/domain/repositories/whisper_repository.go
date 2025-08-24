package repositories

import (
	"context"
	"whisper-server/internal/domain/entities"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// WhisperRepository defines data access for whispers
type WhisperRepository interface {
	Create(ctx context.Context, whisper *entities.Whisper) error
	FindByID(ctx context.Context, id primitive.ObjectID) (*entities.Whisper, error)
	Update(ctx context.Context, whisper *entities.Whisper) error
	Delete(ctx context.Context, id primitive.ObjectID) error
	FindAllByRelationshipID(ctx context.Context, relationshipID primitive.ObjectID, limit, offset int64) ([]*entities.Whisper, error)
}
