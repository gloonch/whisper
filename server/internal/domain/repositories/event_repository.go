package repositories

import (
	"context"
	"whisper-server/internal/domain/entities"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// EventRepository defines data access for events
type EventRepository interface {
	Create(ctx context.Context, event *entities.Event) error
	FindByID(ctx context.Context, id primitive.ObjectID) (*entities.Event, error)
	Update(ctx context.Context, event *entities.Event) error
	Delete(ctx context.Context, id primitive.ObjectID) error
	FindAllByUserID(ctx context.Context, userID primitive.ObjectID, limit, offset int64) ([]*entities.Event, error)
	FindAllByRelationshipID(ctx context.Context, relationshipID primitive.ObjectID, limit, offset int64) ([]*entities.Event, error)
}
