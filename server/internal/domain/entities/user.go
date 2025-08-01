package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name         string             `bson:"name" json:"name" validate:"required,min=2,max=50"`
	Username     string             `bson:"username" json:"username" validate:"required,min=3,max=20,alphanum"`
	Email        string             `bson:"email,omitempty" json:"email" validate:"omitempty,email"`
	PasswordHash string             `bson:"passwordHash" json:"-" validate:"required"`

	// Avatar information
	Avatar *Avatar `bson:"avatar,omitempty" json:"avatar"`

	// Settings & Preferences
	Settings UserSettings `bson:"settings" json:"settings"`

	// Statistics (calculated fields)
	Stats UserStats `bson:"stats" json:"stats"`

	// Relationship
	RelationshipID *primitive.ObjectID `bson:"relationshipId,omitempty" json:"relationshipId"`

	// Metadata
	CreatedAt    time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time `bson:"updatedAt" json:"updatedAt"`
	LastActiveAt time.Time `bson:"lastActiveAt" json:"lastActiveAt"`
	IsActive     bool      `bson:"isActive" json:"isActive"`
}

type Avatar struct {
	Type       string    `bson:"type" json:"type"` // "base64" or "url"
	Data       string    `bson:"data" json:"data"`
	Filename   string    `bson:"filename" json:"filename"`
	Size       int64     `bson:"size" json:"size"`
	UploadedAt time.Time `bson:"uploadedAt" json:"uploadedAt"`
}

type UserSettings struct {
	AutoPublic    bool                 `bson:"autoPublic" json:"autoPublic"`
	Language      string               `bson:"language" json:"language"` // "en", "fa"
	Timezone      string               `bson:"timezone" json:"timezone"`
	Notifications NotificationSettings `bson:"notifications" json:"notifications"`
}

type NotificationSettings struct {
	Whispers bool `bson:"whispers" json:"whispers"`
	Events   bool `bson:"events" json:"events"`
	Partner  bool `bson:"partner" json:"partner"`
}

type UserStats struct {
	MemoriesCount     int `bson:"memoriesCount" json:"memoriesCount"`
	WhispersCount     int `bson:"whispersCount" json:"whispersCount"`
	PublicEventsCount int `bson:"publicEventsCount" json:"publicEventsCount"`
	RelationshipDays  int `bson:"relationshipDays" json:"relationshipDays"`
}

// Domain methods
func NewUser(username, name, email, passwordHash string) *User {
	now := time.Now()
	return &User{
		ID:           primitive.NewObjectID(),
		Name:         name,
		Username:     username,
		Email:        email,
		PasswordHash: passwordHash,
		Settings: UserSettings{
			AutoPublic: false,
			Language:   "en",
			Timezone:   "UTC",
			Notifications: NotificationSettings{
				Whispers: true,
				Events:   true,
				Partner:  true,
			},
		},
		Stats: UserStats{
			MemoriesCount:     0,
			WhispersCount:     0,
			PublicEventsCount: 0,
			RelationshipDays:  0,
		},
		CreatedAt:    now,
		UpdatedAt:    now,
		LastActiveAt: now,
		IsActive:     true,
	}
}

func (u *User) UpdateLastActive() {
	u.LastActiveAt = time.Now()
	u.UpdatedAt = time.Now()
}

func (u *User) UpdateProfile(name, username string, avatar *Avatar) {
	if name != "" {
		u.Name = name
	}
	if username != "" {
		u.Username = username
	}
	if avatar != nil {
		u.Avatar = avatar
	}
	u.UpdatedAt = time.Now()
}

func (u *User) UpdateSettings(settings UserSettings) {
	u.Settings = settings
	u.UpdatedAt = time.Now()
}

func (u *User) IncrementMemoriesCount() {
	u.Stats.MemoriesCount++
	u.UpdatedAt = time.Now()
}

func (u *User) IncrementWhispersCount() {
	u.Stats.WhispersCount++
	u.UpdatedAt = time.Now()
}

func (u *User) SetRelationship(relationshipID primitive.ObjectID, relationshipDays int) {
	u.RelationshipID = &relationshipID
	u.Stats.RelationshipDays = relationshipDays
	u.UpdatedAt = time.Now()
}

func (u *User) HasRelationship() bool {
	return u.RelationshipID != nil
}
