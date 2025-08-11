package dto

import "time"

type CreateEventRequest struct {
    Title       string    `json:"title" binding:"required,min=1,max=100"`
    Description string    `json:"description" binding:"max=500"`
    Date        time.Time `json:"date" binding:"required"`
    Type        string    `json:"type" binding:"required"`
    // optional image payload (base64 or url) could be added later
}

type UpdateEventRequest struct {
    Title       string    `json:"title" binding:"omitempty,min=1,max=100"`
    Description string    `json:"description" binding:"omitempty,max=500"`
    Date        time.Time `json:"date" binding:"omitempty"`
    Type        string    `json:"type" binding:"omitempty"`
}

type EventResponse struct {
    ID            string    `json:"id"`
    Title         string    `json:"title"`
    Description   string    `json:"description,omitempty"`
    Date          time.Time `json:"date"`
    Type          string    `json:"type"`
    Category      string    `json:"category"`
    RelationshipID string   `json:"relationshipId"`
    CreatedBy     string    `json:"createdBy"`
    IsPublic      bool      `json:"isPublic"`
    CreatedAt     time.Time `json:"createdAt"`
    UpdatedAt     time.Time `json:"updatedAt"`
}

