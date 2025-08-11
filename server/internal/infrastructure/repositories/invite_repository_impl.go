package repositories

import (
    "context"
    "errors"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"

    domainEntities "whisper-server/internal/domain/entities"
    domainRepos "whisper-server/internal/domain/repositories"
    "whisper-server/internal/infrastructure/database"
)

type inviteRepositoryImpl struct {
    db *database.MongoDB
}

func NewInviteRepository(db *database.MongoDB) domainRepos.InviteRepository {
    return &inviteRepositoryImpl{db: db}
}

func (r *inviteRepositoryImpl) Create(ctx context.Context, inv *domainEntities.InviteCode) error {
    inv.CreatedAt = time.Now()
    inv.UpdatedAt = time.Now()
    _, err := r.db.InviteCodes().InsertOne(ctx, inv)
    return err
}

func (r *inviteRepositoryImpl) FindByCode(ctx context.Context, code string) (*domainEntities.InviteCode, error) {
    var inv domainEntities.InviteCode
    err := r.db.InviteCodes().FindOne(ctx, bson.M{"code": code}).Decode(&inv)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            return nil, errors.New("invite code not found")
        }
        return nil, err
    }
    return &inv, nil
}

func (r *inviteRepositoryImpl) MarkUsed(ctx context.Context, inv *domainEntities.InviteCode) error {
    inv.IsUsed = true
    inv.UpdatedAt = time.Now()
    _, err := r.db.InviteCodes().UpdateOne(ctx, bson.M{"code": inv.Code}, bson.M{"$set": bson.M{"isUsed": true, "updatedAt": inv.UpdatedAt}})
    return err
}

