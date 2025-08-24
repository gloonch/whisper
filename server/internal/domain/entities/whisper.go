package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Whisper represents a lightweight, repeatable suggestion/reminder between partners
type Whisper struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Type           string             `bson:"type" json:"type"`                     // e.g. watch_sunset, cook_together, custom
	Text           string             `bson:"text,omitempty" json:"text,omitempty"` // resolved display text or custom text
	Recurrence     string             `bson:"recurrence" json:"recurrence"`         // once, everyday, weekly (future)
	Date           time.Time          `bson:"date" json:"date"`                     // for once: the day; for everyday: start date
	RelationshipID primitive.ObjectID `bson:"relationshipId" json:"relationshipId"`
	CreatedBy      primitive.ObjectID `bson:"createdBy" json:"createdBy"`
	IsDone         bool               `bson:"isDone" json:"isDone"`
	CreatedAt      time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt      time.Time          `bson:"updatedAt" json:"updatedAt"`
}

const (
	WhisperRecurrenceOnce     = "once"
	WhisperRecurrenceEveryday = "everyday"
	WhisperRecurrenceWeekly   = "weekly"
)

func NewWhisper(whisperType, text, recurrence string, date time.Time, relationshipID, createdBy primitive.ObjectID) *Whisper {
	now := time.Now()
	return &Whisper{
		ID:             primitive.NewObjectID(),
		Type:           whisperType,
		Text:           text,
		Recurrence:     recurrence,
		Date:           date,
		RelationshipID: relationshipID,
		CreatedBy:      createdBy,
		IsDone:         false,
		CreatedAt:      now,
		UpdatedAt:      now,
	}
}

func (w *Whisper) ToggleDone() {
	w.IsDone = !w.IsDone
	w.UpdatedAt = time.Now()
}

func (w *Whisper) Update(text string, recurrence string, date time.Time) {
	if text != "" {
		w.Text = text
	}
	if recurrence != "" {
		w.Recurrence = recurrence
	}
	if !date.IsZero() {
		w.Date = date
	}
	w.UpdatedAt = time.Now()
}
