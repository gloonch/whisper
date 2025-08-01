package services

import (
	"errors"
	"time"

	"whisper-server/internal/infrastructure/config"

	"github.com/golang-jwt/jwt/v4"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JWTService interface {
	GenerateTokens(userID primitive.ObjectID, username string) (accessToken, refreshToken string, err error)
	ValidateAccessToken(tokenString string) (*Claims, error)
	ValidateRefreshToken(tokenString string) (*Claims, error)
	RefreshAccessToken(refreshToken string) (string, error)
}

type Claims struct {
	UserID   string `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type jwtService struct {
	secretKey            string
	accessTokenDuration  time.Duration
	refreshTokenDuration time.Duration
}

func NewJWTService(cfg *config.Config) JWTService {
	accessDuration, _ := time.ParseDuration(cfg.JWT.AccessExpiresIn)
	refreshDuration, _ := time.ParseDuration(cfg.JWT.RefreshExpiresIn)

	return &jwtService{
		secretKey:            cfg.JWT.Secret,
		accessTokenDuration:  accessDuration,
		refreshTokenDuration: refreshDuration,
	}
}

func (s *jwtService) GenerateTokens(userID primitive.ObjectID, username string) (accessToken, refreshToken string, err error) {
	// Generate Access Token
	accessClaims := &Claims{
		UserID:   userID.Hex(),
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.accessTokenDuration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   userID.Hex(),
		},
	}

	accessTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessToken, err = accessTokenObj.SignedString([]byte(s.secretKey))
	if err != nil {
		return "", "", err
	}

	// Generate Refresh Token
	refreshClaims := &Claims{
		UserID:   userID.Hex(),
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.refreshTokenDuration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   userID.Hex(),
		},
	}

	refreshTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshToken, err = refreshTokenObj.SignedString([]byte(s.secretKey))
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (s *jwtService) ValidateAccessToken(tokenString string) (*Claims, error) {
	return s.validateToken(tokenString)
}

func (s *jwtService) ValidateRefreshToken(tokenString string) (*Claims, error) {
	return s.validateToken(tokenString)
}

func (s *jwtService) validateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(s.secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

func (s *jwtService) RefreshAccessToken(refreshToken string) (string, error) {
	claims, err := s.ValidateRefreshToken(refreshToken)
	if err != nil {
		return "", err
	}

	userID, err := primitive.ObjectIDFromHex(claims.UserID)
	if err != nil {
		return "", err
	}

	newAccessToken, _, err := s.GenerateTokens(userID, claims.Username)
	if err != nil {
		return "", err
	}

	return newAccessToken, nil
}
