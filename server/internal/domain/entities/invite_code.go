package entities

import (
    "time"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type InviteCode struct {
    ID               primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Code             string             `bson:"code" json:"code"`
    CreatedBy        primitive.ObjectID `bson:"createdBy" json:"createdBy"`
    FirstMeetingDate time.Time          `bson:"firstMeetingDate" json:"firstMeetingDate"`
    IsUsed           bool               `bson:"isUsed" json:"isUsed"`
    ExpiresAt        *time.Time         `bson:"expiresAt,omitempty" json:"expiresAt,omitempty"`
    CreatedAt        time.Time          `bson:"createdAt" json:"createdAt"`
    UpdatedAt        time.Time          `bson:"updatedAt" json:"updatedAt"`
}

func NewInviteCode(code string, createdBy primitive.ObjectID, firstMeetingDate time.Time, expiresAt *time.Time) *InviteCode {
    now := time.Now()
    return &InviteCode{
        ID:               primitive.NewObjectID(),
        Code:             code,
        CreatedBy:        createdBy,
        FirstMeetingDate: firstMeetingDate,
        IsUsed:           false,
        ExpiresAt:        expiresAt,
        CreatedAt:        now,
        UpdatedAt:        now,
    }
}

