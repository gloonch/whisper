package usecases

import (
	"context"
	"errors"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/domain/entities"
	"whisper-server/internal/domain/repositories"
	"whisper-server/internal/infrastructure/services"
)

type AuthUseCase interface {
	Register(ctx context.Context, req *dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(ctx context.Context, req *dto.LoginRequest) (*dto.AuthResponse, error)
	RefreshToken(ctx context.Context, req *dto.RefreshTokenRequest) (*dto.TokenResponse, error)
}

type authUseCase struct {
	userRepo        repositories.UserRepository
	jwtService      services.JWTService
	passwordService services.PasswordService
}

func NewAuthUseCase(
	userRepo repositories.UserRepository,
	jwtService services.JWTService,
	passwordService services.PasswordService,
) AuthUseCase {
	return &authUseCase{
		userRepo:        userRepo,
		jwtService:      jwtService,
		passwordService: passwordService,
	}
}

func (uc *authUseCase) Register(ctx context.Context, req *dto.RegisterRequest) (*dto.AuthResponse, error) {
	// Check if username already exists
	exists, err := uc.userRepo.ExistsByUsername(ctx, req.Username)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("username already exists")
	}

	// Check if email already exists
	exists, err = uc.userRepo.ExistsByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("email already exists")
	}

	// Hash password
	hashedPassword, err := uc.passwordService.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// Create user entity
	user := entities.NewUser(req.Username, req.Name, req.Email, hashedPassword)

	// Save user to database
	err = uc.userRepo.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	// Generate tokens
	accessToken, refreshToken, err := uc.jwtService.GenerateTokens(user.ID, user.Username)
	if err != nil {
		return nil, err
	}

	// Convert to response DTO
	return &dto.AuthResponse{
		User:         uc.toUserResponse(user),
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    24 * 60 * 60, // 24 hours in seconds
	}, nil
}

func (uc *authUseCase) Login(ctx context.Context, req *dto.LoginRequest) (*dto.AuthResponse, error) {
	// Find user by username
	user, err := uc.userRepo.FindByUsername(ctx, req.Username)
	if err != nil {
		return nil, errors.New("invalid username or password")
	}

	// Verify password
	err = uc.passwordService.VerifyPassword(user.PasswordHash, req.Password)
	if err != nil {
		return nil, errors.New("invalid username or password")
	}

	// Generate tokens
	accessToken, refreshToken, err := uc.jwtService.GenerateTokens(user.ID, user.Username)
	if err != nil {
		return nil, err
	}

	// Convert to response DTO
	return &dto.AuthResponse{
		User:         uc.toUserResponse(user),
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    24 * 60 * 60, // 24 hours in seconds
	}, nil
}

func (uc *authUseCase) RefreshToken(ctx context.Context, req *dto.RefreshTokenRequest) (*dto.TokenResponse, error) {
	// Validate refresh token and get new access token
	newAccessToken, err := uc.jwtService.RefreshAccessToken(req.RefreshToken)
	if err != nil {
		return nil, errors.New("invalid refresh token")
	}

	return &dto.TokenResponse{
		AccessToken:  newAccessToken,
		RefreshToken: req.RefreshToken, // Keep the same refresh token
		ExpiresIn:    24 * 60 * 60,     // 24 hours in seconds
	}, nil
}

func (uc *authUseCase) toUserResponse(user *entities.User) dto.UserResponse {
	userResp := dto.UserResponse{
		ID:        user.ID.Hex(),
		Username:  user.Username,
		Email:     user.Email,
		Name:      user.Name,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	// Convert avatar if exists
	if user.Avatar != nil {
		userResp.Avatar = &dto.UserAvatar{
			URL:      user.Avatar.Data,
			MimeType: user.Avatar.Type,
		}
	}

	// Convert relationship ID if exists
	if user.RelationshipID != nil {
		relationshipID := user.RelationshipID.Hex()
		userResp.RelationshipID = &relationshipID
	}

	return userResp
}
