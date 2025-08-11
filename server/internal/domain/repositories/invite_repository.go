package repositories

import (
    "context"
    "whisper-server/internal/domain/entities"
)

type InviteRepository interface {
    Create(ctx context.Context, inv *entities.InviteCode) error
    FindByCode(ctx context.Context, code string) (*entities.InviteCode, error)
    MarkUsed(ctx context.Context, inv *entities.InviteCode) error
}

