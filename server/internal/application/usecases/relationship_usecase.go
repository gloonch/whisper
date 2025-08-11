package usecases

import (
	"context"
	"crypto/rand"
	"log"
	"math/big"
	"time"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/domain/entities"
	domainRepos "whisper-server/internal/domain/repositories"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type RelationshipUseCase interface {
	GenerateInvitationCode(ctx context.Context, userID primitive.ObjectID, firstMeetingDate time.Time) (*dto.GenerateInviteCodeResponse, error)
	JoinWithInviteCode(ctx context.Context, userID primitive.ObjectID, code string) (*dto.RelationshipResponse, error)
	GetCurrentRelationship(ctx context.Context, userID primitive.ObjectID) (*dto.RelationshipResponse, error)
	DisconnectRelationship(ctx context.Context, userID primitive.ObjectID) error
}

type relationshipUseCase struct {
	relRepo  domainRepos.RelationshipRepository
	userRepo domainRepos.UserRepository
	invRepo  domainRepos.InviteRepository
}

func NewRelationshipUseCase(relRepo domainRepos.RelationshipRepository, userRepo domainRepos.UserRepository, invRepo domainRepos.InviteRepository) RelationshipUseCase {
	return &relationshipUseCase{relRepo: relRepo, userRepo: userRepo, invRepo: invRepo}
}

func (uc *relationshipUseCase) GenerateInvitationCode(ctx context.Context, userID primitive.ObjectID, firstMeetingDate time.Time) (*dto.GenerateInviteCodeResponse, error) {
	log.Printf("[REL][INVITE][START] user=%s", userID.Hex())
	exp := time.Now().Add(7 * 24 * time.Hour)

	// Try up to 5 times to generate a unique short code (8 chars)
	const maxAttempts = 5
	for attempt := 1; attempt <= maxAttempts; attempt++ {
		code, err := randomAlnum(8)
		if err != nil {
			log.Printf("[REL][INVITE][ERROR] user=%s gen_code err=%v", userID.Hex(), err)
			return nil, err
		}
		inv := entities.NewInviteCode(code, userID, firstMeetingDate, &exp)
		if err := uc.invRepo.Create(ctx, inv); err != nil {
			if mongo.IsDuplicateKeyError(err) {
				log.Printf("[REL][INVITE][WARN] user=%s duplicate code=%s attempt=%d", userID.Hex(), code, attempt)
				continue
			}
			log.Printf("[REL][INVITE][ERROR] user=%s err=%v", userID.Hex(), err)
			return nil, err
		}
		log.Printf("[REL][INVITE][DONE] user=%s code=%s", userID.Hex(), code)
		return &dto.GenerateInviteCodeResponse{InviteCode: code, ExpiresAt: &exp}, nil
	}
	return nil, fmtError("failed to generate unique invite code")
}

// randomAlnum generates a random uppercase alphanumeric string of given length
func randomAlnum(n int) (string, error) {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no confusing chars like 0,O,1,I
	b := make([]byte, n)
	for i := range b {
		idxBig, err := rand.Int(rand.Reader, big.NewInt(int64(len(alphabet))))
		if err != nil {
			return "", err
		}
		b[i] = alphabet[idxBig.Int64()]
	}
	return string(b), nil
}

func (uc *relationshipUseCase) JoinWithInviteCode(ctx context.Context, userID primitive.ObjectID, code string) (*dto.RelationshipResponse, error) {
	log.Printf("[REL][JOIN][START] user=%s code=%s", userID.Hex(), code)
	inv, err := uc.invRepo.FindByCode(ctx, code)
	if err != nil {
		log.Printf("[REL][JOIN][ERROR] find code=%s err=%v", code, err)
		return nil, err
	}
    rel := &entities.Relationship{
        Partners: []entities.RelationshipPartner{
            {UserID: inv.CreatedBy, JoinedAt: time.Now()},
            {UserID: userID, JoinedAt: time.Now()},
        },
        Status:     entities.RelationshipStatusActive,
        InviteCode: inv.Code,
        CreatedAt:  time.Now(),
        UpdatedAt:  time.Now(),
    }
    if err := uc.relRepo.CreateWithDetails(ctx, rel, []primitive.ObjectID{inv.CreatedBy, userID}, inv.FirstMeetingDate); err != nil {
		log.Printf("[REL][JOIN][ERROR] create rel err=%v", err)
		return nil, err
	}
	_ = uc.invRepo.MarkUsed(ctx, inv)
	// Update users to reference relationship
	for _, p := range rel.Partners {
		if u, err := uc.userRepo.FindByID(ctx, p.UserID); err == nil {
			u.SetRelationship(rel.ID, calculateRelationshipDays(rel))
			_ = uc.userRepo.Update(ctx, u)
		}
	}
	log.Printf("[REL][JOIN][DONE] user=%s rel=%s", userID.Hex(), rel.ID.Hex())
	return toRelationshipResponse(rel), nil
}

func (uc *relationshipUseCase) GetCurrentRelationship(ctx context.Context, userID primitive.ObjectID) (*dto.RelationshipResponse, error) {
	log.Printf("[REL][CURRENT][START] user=%s", userID.Hex())
	rel, err := uc.relRepo.FindCurrentByUserID(ctx, userID)
	if err != nil {
		log.Printf("[REL][CURRENT][ERROR] user=%s err=%v", userID.Hex(), err)
		return nil, err
	}
	log.Printf("[REL][CURRENT][DONE] user=%s rel=%s", userID.Hex(), rel.ID.Hex())
	return toRelationshipResponse(rel), nil
}

func (uc *relationshipUseCase) DisconnectRelationship(ctx context.Context, userID primitive.ObjectID) error {
	log.Printf("[REL][DISCONNECT][START] user=%s", userID.Hex())
	rel, err := uc.relRepo.FindCurrentByUserID(ctx, userID)
	if err != nil {
		log.Printf("[REL][DISCONNECT][ERROR] find current err=%v", err)
		return err
	}
	rel.Disconnect()
	if err := uc.relRepo.Update(ctx, rel); err != nil {
		log.Printf("[REL][DISCONNECT][ERROR] update err=%v", err)
		return err
	}
	// Optionally clear user pointers
	for _, p := range rel.Partners {
		if u, err := uc.userRepo.FindByID(ctx, p.UserID); err == nil {
			u.RelationshipID = nil
			u.Stats.RelationshipDays = 0
			_ = uc.userRepo.Update(ctx, u)
		}
	}
	log.Printf("[REL][DISCONNECT][DONE] user=%s rel=%s", userID.Hex(), rel.ID.Hex())
	return nil
}

func toRelationshipResponse(rel *entities.Relationship) *dto.RelationshipResponse {
	partners := make([]dto.RelationshipPartner, 0, len(rel.Partners))
	for _, p := range rel.Partners {
		partners = append(partners, dto.RelationshipPartner{UserID: p.UserID.Hex(), JoinedAt: p.JoinedAt})
	}
	return &dto.RelationshipResponse{
		ID:         rel.ID.Hex(),
		Status:     string(rel.Status),
		Partners:   partners,
		InviteCode: rel.InviteCode,
		CreatedAt:  rel.CreatedAt,
		UpdatedAt:  rel.UpdatedAt,
	}
}

func calculateRelationshipDays(rel *entities.Relationship) int {
	if len(rel.Partners) == 0 {
		return 0
	}
	// min joinedAt among partners
	earliest := rel.Partners[0].JoinedAt
	for _, p := range rel.Partners {
		if p.JoinedAt.Before(earliest) {
			earliest = p.JoinedAt
		}
	}
	return int(time.Since(earliest).Hours() / 24)
}
