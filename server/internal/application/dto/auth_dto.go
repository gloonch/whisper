package dto

import "time"

// Authentication Request DTOs
type RegisterRequest struct {
	Username         string     `json:"username" binding:"required,min=3,max=30"`
	Email            string     `json:"email" binding:"required,email"`
	Password         string     `json:"password" binding:"required,min=6,max=100"`
	Name             string     `json:"name" binding:"required,min=2,max=100"`
	FirstMeetingDate *time.Time `json:"firstMeetingDate,omitempty"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

// Authentication Response DTOs
type AuthResponse struct {
	User         UserResponse `json:"user"`
	AccessToken  string       `json:"accessToken"`
	RefreshToken string       `json:"refreshToken"`
	ExpiresIn    int64        `json:"expiresIn"` // seconds
}

type UserResponse struct {
	ID             string      `json:"id"`
	Username       string      `json:"username"`
	Email          string      `json:"email"`
	Name           string      `json:"name"`
	Avatar         *UserAvatar `json:"avatar,omitempty"`
	RelationshipID *string     `json:"relationshipId,omitempty"`
	CreatedAt      time.Time   `json:"createdAt"`
	UpdatedAt      time.Time   `json:"updatedAt"`
}

type UserAvatar struct {
	URL      string `json:"url,omitempty"`
	Base64   string `json:"base64,omitempty"`
	MimeType string `json:"mimeType,omitempty"`
}

type TokenResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int64  `json:"expiresIn"`
}

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}
