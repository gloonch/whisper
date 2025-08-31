package usecases

import (
	"context"
	"log"
	"time"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/domain/entities"
	"whisper-server/internal/domain/repositories"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserUseCase interface {
	GetProfile(ctx context.Context, userID primitive.ObjectID) (*dto.UserProfileResponse, error)
	UpdateProfile(ctx context.Context, userID primitive.ObjectID, req *dto.UpdateUserProfileRequest) (*dto.UserProfileResponse, error)
}

type userUseCase struct {
	userRepo repositories.UserRepository
}

func NewUserUseCase(userRepo repositories.UserRepository) UserUseCase {
	return &userUseCase{
		userRepo: userRepo,
	}
}

func (uc *userUseCase) GetProfile(ctx context.Context, userID primitive.ObjectID) (*dto.UserProfileResponse, error) {
	log.Printf("[USER][GET_PROFILE][START] user=%s", userID.Hex())

	user, err := uc.userRepo.FindByID(ctx, userID)
	if err != nil {
		log.Printf("[USER][GET_PROFILE][ERROR] user=%s err=%v", userID.Hex(), err)
		return nil, err
	}

	avatarData := ""
	if user.Avatar != nil {
		avatarData = user.Avatar.Data
	}

	response := &dto.UserProfileResponse{
		ID:       user.ID.Hex(),
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
		Avatar:   avatarData,
	}

	log.Printf("[USER][GET_PROFILE][DONE] user=%s", userID.Hex())
	return response, nil
}

func (uc *userUseCase) UpdateProfile(ctx context.Context, userID primitive.ObjectID, req *dto.UpdateUserProfileRequest) (*dto.UserProfileResponse, error) {
	log.Printf("[USER][UPDATE_PROFILE][START] user=%s", userID.Hex())

	// Get current user
	user, err := uc.userRepo.FindByID(ctx, userID)
	if err != nil {
		log.Printf("[USER][UPDATE_PROFILE][ERROR] find user=%s err=%v", userID.Hex(), err)
		return nil, err
	}

	// Apply updates
	if req.Name != nil {
		user.Name = *req.Name
		log.Printf("[USER][UPDATE_PROFILE][NAME] user=%s name=%s", userID.Hex(), *req.Name)
	}

	if req.Avatar != nil {
		now := time.Now()
		user.Avatar = &entities.Avatar{
			Type:       "base64",
			Data:       *req.Avatar,
			Filename:   "avatar.jpg",
			Size:       int64(len(*req.Avatar)),
			UploadedAt: now,
		}
		log.Printf("[USER][UPDATE_PROFILE][AVATAR] user=%s avatar_size=%d", userID.Hex(), len(*req.Avatar))
	}

	// Save updated user
	err = uc.userRepo.Update(ctx, user)
	if err != nil {
		log.Printf("[USER][UPDATE_PROFILE][ERROR] update user=%s err=%v", userID.Hex(), err)
		return nil, err
	}

	avatarData := ""
	if user.Avatar != nil {
		avatarData = user.Avatar.Data
	}

	response := &dto.UserProfileResponse{
		ID:       user.ID.Hex(),
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
		Avatar:   avatarData,
	}

	log.Printf("[USER][UPDATE_PROFILE][DONE] user=%s", userID.Hex())
	return response, nil
}
