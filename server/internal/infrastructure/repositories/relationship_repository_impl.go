package repositories

import (
    "context"
    "errors"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"

    domainEntities "whisper-server/internal/domain/entities"
    domainRepos "whisper-server/internal/domain/repositories"
    "whisper-server/internal/infrastructure/database"
)

type relationshipRepositoryImpl struct {
	db *database.MongoDB
}

func NewRelationshipRepository(db *database.MongoDB) domainRepos.RelationshipRepository {
	return &relationshipRepositoryImpl{db: db}
}

func (r *relationshipRepositoryImpl) Create(ctx context.Context, rel *domainEntities.Relationship) error {
	rel.CreatedAt = time.Now()
	rel.UpdatedAt = time.Now()
	res, err := r.db.Relationships().InsertOne(ctx, rel)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		rel.ID = oid
	}
	return nil
}

func (r *relationshipRepositoryImpl) CreateWithDetails(ctx context.Context, rel *domainEntities.Relationship, users []primitive.ObjectID, firstMeetingDate time.Time) error {
    rel.CreatedAt = time.Now()
    rel.UpdatedAt = time.Now()
    doc := bson.M{
        "partners": rel.Partners,
        "users": users,
        "firstMeetingDate": firstMeetingDate,
        "status": rel.Status,
        "inviteCode": rel.InviteCode,
        "createdAt": rel.CreatedAt,
        "updatedAt": rel.UpdatedAt,
    }
    res, err := r.db.Relationships().InsertOne(ctx, doc)
    if err != nil {
        return err
    }
    if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
        rel.ID = oid
    }
    return nil
}

func (r *relationshipRepositoryImpl) FindByInviteCode(ctx context.Context, code string) (*domainEntities.Relationship, error) {
	var rel domainEntities.Relationship
	err := r.db.Relationships().FindOne(ctx, bson.M{"inviteCode": code}).Decode(&rel)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("invite code not found")
		}
		return nil, err
	}
	return &rel, nil
}

func (r *relationshipRepositoryImpl) FindCurrentByUserID(ctx context.Context, userID primitive.ObjectID) (*domainEntities.Relationship, error) {
	filter := bson.M{
		"partners": bson.M{"$elemMatch": bson.M{"userId": userID}},
		"status":   domainEntities.RelationshipStatusActive,
	}
	var rel domainEntities.Relationship
	err := r.db.Relationships().FindOne(ctx, filter).Decode(&rel)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("no active relationship")
		}
		return nil, err
	}
	return &rel, nil
}

func (r *relationshipRepositoryImpl) Update(ctx context.Context, rel *domainEntities.Relationship) error {
	rel.UpdatedAt = time.Now()
	_, err := r.db.Relationships().UpdateOne(ctx, bson.M{"_id": rel.ID}, bson.M{"$set": rel})
	return err
}
