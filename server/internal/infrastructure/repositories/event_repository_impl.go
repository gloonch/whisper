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

type eventRepositoryImpl struct {
	db *database.MongoDB
}

func NewEventRepository(db *database.MongoDB) domainRepos.EventRepository {
	return &eventRepositoryImpl{db: db}
}

func (r *eventRepositoryImpl) Create(ctx context.Context, event *domainEntities.Event) error {
	event.CreatedAt = time.Now()
	event.UpdatedAt = time.Now()
	res, err := r.db.Events().InsertOne(ctx, event)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		event.ID = oid
	}
	return nil
}

func (r *eventRepositoryImpl) FindByID(ctx context.Context, id primitive.ObjectID) (*domainEntities.Event, error) {
	var ev domainEntities.Event
	err := r.db.Events().FindOne(ctx, bson.M{"_id": id}).Decode(&ev)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("event not found")
		}
		return nil, err
	}
	return &ev, nil
}

func (r *eventRepositoryImpl) Update(ctx context.Context, event *domainEntities.Event) error {
	event.UpdatedAt = time.Now()
	update := bson.M{"$set": event}
	_, err := r.db.Events().UpdateOne(ctx, bson.M{"_id": event.ID}, update)
	return err
}

func (r *eventRepositoryImpl) FindAllByUserID(ctx context.Context, userID primitive.ObjectID, limit, offset int64) ([]*domainEntities.Event, error) {
	// Find events created by this user, newest first
	findOpts := options.Find()
	findOpts.SetSort(bson.D{{Key: "date", Value: -1}})
	if limit > 0 {
		findOpts.SetLimit(limit)
	}
	if offset > 0 {
		findOpts.SetSkip(offset)
	}

	cursor, err := r.db.Events().Find(ctx, bson.M{"createdBy": userID}, findOpts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var events []*domainEntities.Event
	for cursor.Next(ctx) {
		var ev domainEntities.Event
		if err := cursor.Decode(&ev); err != nil {
			return nil, err
		}
		events = append(events, &ev)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return events, nil
}

func (r *eventRepositoryImpl) FindAllByRelationshipID(ctx context.Context, relationshipID primitive.ObjectID, limit, offset int64) ([]*domainEntities.Event, error) {
	findOpts := options.Find()
	findOpts.SetSort(bson.D{{Key: "date", Value: -1}})
	if limit > 0 {
		findOpts.SetLimit(limit)
	}
	if offset > 0 {
		findOpts.SetSkip(offset)
	}
	cursor, err := r.db.Events().Find(ctx, bson.M{"relationshipId": relationshipID}, findOpts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	var events []*domainEntities.Event
	for cursor.Next(ctx) {
		var ev domainEntities.Event
		if err := cursor.Decode(&ev); err != nil {
			return nil, err
		}
		events = append(events, &ev)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return events, nil
}
