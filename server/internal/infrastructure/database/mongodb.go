package database

import (
	"context"
	"fmt"
	"time"

	"whisper-server/internal/infrastructure/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MongoDB struct {
	client   *mongo.Client
	database *mongo.Database
	config   config.DatabaseConfig
}

func NewMongoDB(cfg config.DatabaseConfig) (*MongoDB, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(cfg.ConnectTimeout)*time.Second)
	defer cancel()

	// MongoDB connection options
	clientOptions := options.Client().
		ApplyURI(cfg.URI).
		SetMaxPoolSize(cfg.MaxPoolSize).
		SetMinPoolSize(cfg.MinPoolSize).
		SetMaxConnIdleTime(30 * time.Minute).
		SetServerSelectionTimeout(5 * time.Second)

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	// Ping the database
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		return nil, fmt.Errorf("failed to ping MongoDB: %w", err)
	}

	database := client.Database(cfg.Name)

	db := &MongoDB{
		client:   client,
		database: database,
		config:   cfg,
	}

	// Create indexes
	if err := db.createIndexes(ctx); err != nil {
		return nil, fmt.Errorf("failed to create indexes: %w", err)
	}

	return db, nil
}

func (m *MongoDB) GetDatabase() *mongo.Database {
	return m.database
}

func (m *MongoDB) GetClient() *mongo.Client {
	return m.client
}

func (m *MongoDB) Disconnect() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return m.client.Disconnect(ctx)
}

// Collection helpers
func (m *MongoDB) Users() *mongo.Collection {
	return m.database.Collection("users")
}

func (m *MongoDB) Relationships() *mongo.Collection {
	return m.database.Collection("relationships")
}

func (m *MongoDB) Events() *mongo.Collection {
	return m.database.Collection("events")
}

func (m *MongoDB) Whispers() *mongo.Collection {
	return m.database.Collection("whispers")
}

func (m *MongoDB) Todos() *mongo.Collection {
	return m.database.Collection("todos")
}

func (m *MongoDB) PublicEvents() *mongo.Collection {
	return m.database.Collection("public_events")
}

func (m *MongoDB) InviteCodes() *mongo.Collection {
    // Match initialization script which creates 'invitecodes'
    return m.database.Collection("invitecodes")
}

func (m *MongoDB) EventTypes() *mongo.Collection {
	return m.database.Collection("event_types")
}

func (m *MongoDB) WhisperTypes() *mongo.Collection {
	return m.database.Collection("whisper_types")
}

// Create database indexes
func (m *MongoDB) createIndexes(ctx context.Context) error {
	// Users indexes
	usersIndexes := []mongo.IndexModel{
		{
			Keys:    bson.D{{"username", 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    bson.D{{"email", 1}},
			Options: options.Index().SetUnique(true).SetSparse(true),
		},
		{
			Keys: bson.D{{"relationshipId", 1}},
		},
	}
	if _, err := m.Users().Indexes().CreateMany(ctx, usersIndexes); err != nil {
		return fmt.Errorf("failed to create users indexes: %w", err)
	}

	// Relationships indexes
	relationshipsIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{{"partners.userId", 1}},
		},
		{
			Keys:    bson.D{{"inviteCode", 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: bson.D{{"status", 1}},
		},
	}
	if _, err := m.Relationships().Indexes().CreateMany(ctx, relationshipsIndexes); err != nil {
		return fmt.Errorf("failed to create relationships indexes: %w", err)
	}

	// Events indexes
	eventsIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{{"relationshipId", 1}, {"date", -1}},
		},
		{
			Keys: bson.D{{"visibility.isPublic", 1}, {"viewCount", -1}},
		},
		{
			Keys: bson.D{{"createdBy", 1}, {"createdAt", -1}},
		},
		{
			Keys: bson.D{{"type", 1}},
		},
	}
	if _, err := m.Events().Indexes().CreateMany(ctx, eventsIndexes); err != nil {
		return fmt.Errorf("failed to create events indexes: %w", err)
	}

	// Whispers indexes
	whispersIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{{"relationshipId", 1}, {"date", 1}},
		},
		{
			Keys: bson.D{{"isDone", 1}, {"date", 1}},
		},
		{
			Keys: bson.D{{"type", 1}},
		},
	}
	if _, err := m.Whispers().Indexes().CreateMany(ctx, whispersIndexes); err != nil {
		return fmt.Errorf("failed to create whispers indexes: %w", err)
	}

	// Todos indexes
	todosIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{{"relationshipId", 1}, {"isCompleted", 1}},
		},
		{
			Keys: bson.D{{"priority", 1}, {"createdAt", -1}},
		},
		{
			Keys: bson.D{{"dueDate", 1}},
		},
	}
	if _, err := m.Todos().Indexes().CreateMany(ctx, todosIndexes); err != nil {
		return fmt.Errorf("failed to create todos indexes: %w", err)
	}

	// Invite codes indexes
	inviteCodesIndexes := []mongo.IndexModel{
		{
			Keys:    bson.D{{"code", 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: bson.D{{"createdBy", 1}},
		},
		{
			Keys:    bson.D{{"expiresAt", 1}},
			Options: options.Index().SetExpireAfterSeconds(0),
		},
		{
			Keys: bson.D{{"isUsed", 1}},
		},
	}
	if _, err := m.InviteCodes().Indexes().CreateMany(ctx, inviteCodesIndexes); err != nil {
		return fmt.Errorf("failed to create invite codes indexes: %w", err)
	}

	return nil
}
