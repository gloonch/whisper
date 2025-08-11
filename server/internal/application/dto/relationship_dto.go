package dto

import "time"

type GenerateInviteCodeRequest struct {
	FirstMeetingDate time.Time `json:"firstMeetingDate" binding:"required"`
}

type GenerateInviteCodeResponse struct {
	InviteCode string     `json:"inviteCode"`
	ExpiresAt  *time.Time `json:"expiresAt,omitempty"`
}

type JoinWithInviteRequest struct {
	Code string `json:"code" binding:"required"`
}

type RelationshipResponse struct {
	ID         string                `json:"id"`
	Status     string                `json:"status"`
	Partners   []RelationshipPartner `json:"partners"`
	InviteCode string                `json:"inviteCode,omitempty"`
	CreatedAt  time.Time             `json:"createdAt"`
	UpdatedAt  time.Time             `json:"updatedAt"`
}

type RelationshipPartner struct {
	UserID   string    `json:"userId"`
	JoinedAt time.Time `json:"joinedAt"`
}
