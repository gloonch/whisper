package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RelationshipStatus string

const (
	RelationshipStatusPending      RelationshipStatus = "pending"
	RelationshipStatusActive       RelationshipStatus = "active"
	RelationshipStatusDisconnected RelationshipStatus = "disconnected"
)

type RelationshipPartner struct {
	UserID   primitive.ObjectID `bson:"userId" json:"userId"`
	JoinedAt time.Time          `bson:"joinedAt" json:"joinedAt"`
}

type Relationship struct {
	ID         primitive.ObjectID    `bson:"_id,omitempty" json:"id"`
	Partners   []RelationshipPartner `bson:"partners" json:"partners"`
	Status     RelationshipStatus    `bson:"status" json:"status"`
	InviteCode string                `bson:"inviteCode,omitempty" json:"inviteCode,omitempty"`
	CreatedAt  time.Time             `bson:"createdAt" json:"createdAt"`
	UpdatedAt  time.Time             `bson:"updatedAt" json:"updatedAt"`
}

func NewPendingRelationship(inviter primitive.ObjectID, inviteCode string) *Relationship {
	now := time.Now()
	return &Relationship{
		ID: primitive.NewObjectID(),
		Partners: []RelationshipPartner{
			{UserID: inviter, JoinedAt: now},
		},
		Status:     RelationshipStatusPending,
		InviteCode: inviteCode,
		CreatedAt:  now,
		UpdatedAt:  now,
	}
}

func (r *Relationship) ActivateWithPartner(partnerID primitive.ObjectID) {
	now := time.Now()
	// Avoid duplicate partner
	for _, p := range r.Partners {
		if p.UserID == partnerID {
			return
		}
	}
	r.Partners = append(r.Partners, RelationshipPartner{UserID: partnerID, JoinedAt: now})
	r.Status = RelationshipStatusActive
	r.UpdatedAt = now
}

func (r *Relationship) Disconnect() {
	r.Status = RelationshipStatusDisconnected
	r.UpdatedAt = time.Now()
}
