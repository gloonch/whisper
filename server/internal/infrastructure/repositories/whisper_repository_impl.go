package repositories

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	domainEntities "whisper-server/internal/domain/entities"
	domainRepos "whisper-server/internal/domain/repositories"
	"whisper-server/internal/infrastructure/database"
)

type whisperRepositoryImpl struct {
	db *database.MongoDB
}

func NewWhisperRepository(db *database.MongoDB) domainRepos.WhisperRepository {
	return &whisperRepositoryImpl{db: db}
}

func (r *whisperRepositoryImpl) Create(ctx context.Context, whisper *domainEntities.Whisper) error {
	whisper.CreatedAt = time.Now()
	whisper.UpdatedAt = time.Now()
	res, err := r.db.Whispers().InsertOne(ctx, whisper)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		whisper.ID = oid
	}
	return nil
}

func (r *whisperRepositoryImpl) FindByID(ctx context.Context, id primitive.ObjectID) (*domainEntities.Whisper, error) {
	var w domainEntities.Whisper
	err := r.db.Whispers().FindOne(ctx, bson.M{"_id": id}).Decode(&w)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("whisper not found")
		}
		return nil, err
	}
	return &w, nil
}

func (r *whisperRepositoryImpl) Update(ctx context.Context, whisper *domainEntities.Whisper) error {
	whisper.UpdatedAt = time.Now()
	update := bson.M{"$set": whisper}
	_, err := r.db.Whispers().UpdateOne(ctx, bson.M{"_id": whisper.ID}, update)
	return err
}

func (r *whisperRepositoryImpl) Delete(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.db.Whispers().DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *whisperRepositoryImpl) FindAllByRelationshipID(ctx context.Context, relationshipID primitive.ObjectID, limit, offset int64) ([]*domainEntities.Whisper, error) {
	findOpts := options.Find()
	findOpts.SetSort(bson.D{{Key: "date", Value: 1}})
	if limit > 0 {
		findOpts.SetLimit(limit)
	}
	if offset > 0 {
		findOpts.SetSkip(offset)
	}
	cursor, err := r.db.Whispers().Find(ctx, bson.M{"relationshipId": relationshipID}, findOpts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	var whispers []*domainEntities.Whisper
	for cursor.Next(ctx) {
		var w domainEntities.Whisper
		if err := cursor.Decode(&w); err != nil {
			return nil, err
		}
		whispers = append(whispers, &w)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return whispers, nil
}
