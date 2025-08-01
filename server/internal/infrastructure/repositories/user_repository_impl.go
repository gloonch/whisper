package repositories

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"whisper-server/internal/domain/entities"
	"whisper-server/internal/domain/repositories"
	"whisper-server/internal/infrastructure/database"
)

type userRepositoryImpl struct {
	db *database.MongoDB
}

func NewUserRepository(db *database.MongoDB) repositories.UserRepository {
	return &userRepositoryImpl{db: db}
}

func (r *userRepositoryImpl) Create(ctx context.Context, user *entities.User) error {
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	
	result, err := r.db.Users().InsertOne(ctx, user)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return errors.New("username or email already exists")
		}
		return err
	}
	
	user.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *userRepositoryImpl) FindByID(ctx context.Context, id primitive.ObjectID) (*entities.User, error) {
	var user entities.User
	err := r.db.Users().FindOne(ctx, bson.M{"_id": id, "deletedAt": nil}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepositoryImpl) FindByUsername(ctx context.Context, username string) (*entities.User, error) {
	var user entities.User
	err := r.db.Users().FindOne(ctx, bson.M{"username": username, "deletedAt": nil}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepositoryImpl) FindByEmail(ctx context.Context, email string) (*entities.User, error) {
	var user entities.User
	err := r.db.Users().FindOne(ctx, bson.M{"email": email, "deletedAt": nil}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepositoryImpl) Update(ctx context.Context, user *entities.User) error {
	user.UpdatedAt = time.Now()
	
	update := bson.M{"$set": user}
	_, err := r.db.Users().UpdateOne(ctx, bson.M{"_id": user.ID}, update)
	return err
}

func (r *userRepositoryImpl) UpdatePassword(ctx context.Context, userID primitive.ObjectID, hashedPassword string) error {
	update := bson.M{
		"$set": bson.M{
			"passwordHash": hashedPassword,
			"updatedAt":    time.Now(),
		},
	}
	_, err := r.db.Users().UpdateOne(ctx, bson.M{"_id": userID}, update)
	return err
}

func (r *userRepositoryImpl) ExistsByUsername(ctx context.Context, username string) (bool, error) {
	count, err := r.db.Users().CountDocuments(ctx, bson.M{"username": username, "deletedAt": nil})
	return count > 0, err
}

func (r *userRepositoryImpl) ExistsByEmail(ctx context.Context, email string) (bool, error) {
	count, err := r.db.Users().CountDocuments(ctx, bson.M{"email": email, "deletedAt": nil})
	return count > 0, err
}

func (r *userRepositoryImpl) Delete(ctx context.Context, id primitive.ObjectID) error {
	update := bson.M{
		"$set": bson.M{
			"deletedAt": time.Now(),
		},
	}
	_, err := r.db.Users().UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
}