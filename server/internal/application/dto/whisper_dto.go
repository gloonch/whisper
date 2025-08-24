package dto

import "time"

type CreateWhisperRequest struct {
	Type       string    `json:"type" binding:"required"`
	Text       string    `json:"text" binding:"omitempty,max=200"`
	Recurrence string    `json:"recurrence" binding:"required,oneof=once everyday weekly"`
	Date       time.Time `json:"date" binding:"required"`
}

type UpdateWhisperRequest struct {
	Text       string    `json:"text" binding:"omitempty,max=200"`
	Recurrence string    `json:"recurrence" binding:"omitempty,oneof=once everyday weekly"`
	Date       time.Time `json:"date" binding:"omitempty"`
	IsDone     *bool     `json:"isDone" binding:"omitempty"`
}

type WhisperResponse struct {
	ID             string    `json:"id"`
	Type           string    `json:"type"`
	Text           string    `json:"text,omitempty"`
	Recurrence     string    `json:"recurrence"`
	Date           time.Time `json:"date"`
	RelationshipID string    `json:"relationshipId"`
	CreatedBy      string    `json:"createdBy"`
	IsDone         bool      `json:"isDone"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

type ConvertWhisperRequest struct {
	Image *EventImagePayload `json:"image" binding:"omitempty"`
}

type EventImagePayload struct {
	Type     string `json:"type" binding:"omitempty,oneof=base64 url"`
	Data     string `json:"data" binding:"omitempty"`
	Filename string `json:"filename" binding:"omitempty"`
}
