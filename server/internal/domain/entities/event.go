package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Event struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title" validate:"required,min=1,max=100"`
	Description string             `bson:"description,omitempty" json:"description" validate:"max=500"`
	Date        time.Time          `bson:"date" json:"date" validate:"required"`

	// Event Classification
	Type     string `bson:"type" json:"type" validate:"required"`
	Category string `bson:"category" json:"category"`

	// Media & Content
	Image *EventImage `bson:"image,omitempty" json:"image"`

	// Ownership & Sharing
	RelationshipID primitive.ObjectID `bson:"relationshipId" json:"relationshipId" validate:"required"`
	CreatedBy      primitive.ObjectID `bson:"createdBy" json:"createdBy" validate:"required"`

	// Privacy & Visibility
	Visibility EventVisibility `bson:"visibility" json:"visibility"`

	// Source Information
	Source EventSource `bson:"source" json:"source"`

	// Metadata
	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
	ViewCount int       `bson:"viewCount" json:"viewCount"`
}

type EventImage struct {
	Type       string    `bson:"type" json:"type"` // "base64" or "url"
	Data       string    `bson:"data" json:"data"`
	Filename   string    `bson:"filename" json:"filename"`
	Size       int64     `bson:"size" json:"size"`
	UploadedAt time.Time `bson:"uploadedAt" json:"uploadedAt"`
}

type EventVisibility struct {
	IsPublic   bool                 `bson:"isPublic" json:"isPublic"`
	IsShared   bool                 `bson:"isShared" json:"isShared"`
	SharedWith []primitive.ObjectID `bson:"sharedWith" json:"sharedWith"`
}

type EventSource struct {
	Type        string              `bson:"type" json:"type"` // "manual", "todo_completed", "whisper_converted"
	SourceID    *primitive.ObjectID `bson:"sourceId,omitempty" json:"sourceId"`
	CompletedAt *time.Time          `bson:"completedAt,omitempty" json:"completedAt"`
}

// Event types constants
const (
	EventTypeMeeting       = "MEETING"
	EventTypeTrip          = "TRIP"
	EventTypeParty         = "PARTY"
	EventTypeBirthday      = "BIRTHDAY"
	EventTypeAnniversary   = "ANNIVERSARY"
	EventTypeDate          = "DATE"
	EventTypeFightMakeup   = "FIGHT_MAKEUP"
	EventTypeTodoCompleted = "TODO_COMPLETED"
)

// Event categories
const (
	EventCategoryMilestone = "milestone"
	EventCategoryActivity  = "activity"
	EventCategorySpecial   = "special"
)

// Source types
const (
	SourceTypeManual           = "manual"
	SourceTypeTodoCompleted    = "todo_completed"
	SourceTypeWhisperConverted = "whisper_converted"
)

// Domain methods
func NewEvent(title, eventType string, date time.Time, relationshipID, createdBy primitive.ObjectID) *Event {
	now := time.Now()
	return &Event{
		ID:             primitive.NewObjectID(),
		Title:          title,
		Date:           date,
		Type:           eventType,
		Category:       getEventCategory(eventType),
		RelationshipID: relationshipID,
		CreatedBy:      createdBy,
		Visibility: EventVisibility{
			IsPublic:   false,
			IsShared:   true,
			SharedWith: []primitive.ObjectID{},
		},
		Source: EventSource{
			Type: SourceTypeManual,
		},
		CreatedAt: now,
		UpdatedAt: now,
		ViewCount: 0,
	}
}

func NewEventFromTodo(title string, date time.Time, relationshipID, createdBy, todoID primitive.ObjectID) *Event {
	now := time.Now()
	return &Event{
		ID:             primitive.NewObjectID(),
		Title:          title,
		Date:           date,
		Type:           EventTypeTodoCompleted,
		Category:       EventCategoryActivity,
		RelationshipID: relationshipID,
		CreatedBy:      createdBy,
		Visibility: EventVisibility{
			IsPublic:   false,
			IsShared:   true,
			SharedWith: []primitive.ObjectID{},
		},
		Source: EventSource{
			Type:        SourceTypeTodoCompleted,
			SourceID:    &todoID,
			CompletedAt: &now,
		},
		CreatedAt: now,
		UpdatedAt: now,
		ViewCount: 0,
	}
}

func (e *Event) Update(title, description string, date time.Time, eventType string) {
	if title != "" {
		e.Title = title
	}
	if description != "" {
		e.Description = description
	}
	if !date.IsZero() {
		e.Date = date
	}
	if eventType != "" {
		e.Type = eventType
		e.Category = getEventCategory(eventType)
	}
	e.UpdatedAt = time.Now()
}

func (e *Event) SetImage(image *EventImage) {
	e.Image = image
	e.UpdatedAt = time.Now()
}

func (e *Event) MakePublic() {
	e.Visibility.IsPublic = true
	e.UpdatedAt = time.Now()
}

func (e *Event) MakePrivate() {
	e.Visibility.IsPublic = false
	e.UpdatedAt = time.Now()
}

func (e *Event) IncrementViewCount() {
	e.ViewCount++
}

func (e *Event) ShareWith(userIDs []primitive.ObjectID) {
	e.Visibility.SharedWith = append(e.Visibility.SharedWith, userIDs...)
	e.UpdatedAt = time.Now()
}

func (e *Event) IsPublic() bool {
	return e.Visibility.IsPublic
}

func (e *Event) IsSharedWith(userID primitive.ObjectID) bool {
	for _, id := range e.Visibility.SharedWith {
		if id == userID {
			return true
		}
	}
	return false
}

func getEventCategory(eventType string) string {
	switch eventType {
	case EventTypeMeeting, EventTypeAnniversary:
		return EventCategoryMilestone
	case EventTypeBirthday, EventTypeParty:
		return EventCategorySpecial
	default:
		return EventCategoryActivity
	}
}
