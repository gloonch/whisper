package dto

// UpdateUserProfileRequest represents the request to update user profile
type UpdateUserProfileRequest struct {
	Name   *string `json:"name,omitempty"`
	Avatar *string `json:"avatar,omitempty"`
}

// UserProfileResponse represents the user profile response
type UserProfileResponse struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Avatar   string `json:"avatar,omitempty"`
}
