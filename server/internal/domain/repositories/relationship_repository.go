package repositories

import (
    "context"
    "time"
    "whisper-server/internal/domain/entities"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type RelationshipRepository interface {
    Create(ctx context.Context, r *entities.Relationship) error
    // CreateWithDetails writes fields required by DB schema (users, firstMeetingDate)
    CreateWithDetails(ctx context.Context, r *entities.Relationship, users []primitive.ObjectID, firstMeetingDate time.Time) error
    FindByInviteCode(ctx context.Context, code string) (*entities.Relationship, error)
    FindCurrentByUserID(ctx context.Context, userID primitive.ObjectID) (*entities.Relationship, error)
    Update(ctx context.Context, r *entities.Relationship) error
}
