package usecases

import (
	"context"
	"log"
	"time"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/domain/entities"
	domainRepos "whisper-server/internal/domain/repositories"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WhisperUseCase interface {
	Create(ctx context.Context, userID primitive.ObjectID, req *dto.CreateWhisperRequest) (*dto.WhisperResponse, error)
	ListByCurrentRelationship(ctx context.Context, userID primitive.ObjectID, limit, offset int64) ([]*dto.WhisperResponse, error)
	Update(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID, req *dto.UpdateWhisperRequest) (*dto.WhisperResponse, error)
	Delete(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error
	ConvertToEvent(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID, img *dto.EventImagePayload) (*dto.EventResponse, error)
}

type whisperUseCase struct {
	repo      domainRepos.WhisperRepository
	relRepo   domainRepos.RelationshipRepository
	eventRepo domainRepos.EventRepository
}

func NewWhisperUseCase(repo domainRepos.WhisperRepository, relRepo domainRepos.RelationshipRepository, eventRepo domainRepos.EventRepository) WhisperUseCase {
	return &whisperUseCase{repo: repo, relRepo: relRepo, eventRepo: eventRepo}
}

func (uc *whisperUseCase) Create(ctx context.Context, userID primitive.ObjectID, req *dto.CreateWhisperRequest) (*dto.WhisperResponse, error) {
	log.Printf("[WHISPER][CREATE][START] user=%s type=%s rec=%s", userID.Hex(), req.Type, req.Recurrence)
	rel, err := uc.relRepo.FindCurrentByUserID(ctx, userID)
	if err != nil {
		log.Printf("[WHISPER][CREATE][ERROR] user=%s no current relationship: %v", userID.Hex(), err)
		return nil, err
	}
	w := entities.NewWhisper(req.Type, req.Text, req.Recurrence, req.Date, rel.ID, userID)
	if err := uc.repo.Create(ctx, w); err != nil {
		log.Printf("[WHISPER][CREATE][ERROR] user=%s err=%v", userID.Hex(), err)
		return nil, err
	}
	log.Printf("[WHISPER][CREATE][DONE] user=%s id=%s", userID.Hex(), w.ID.Hex())
	return toWhisperResponse(w), nil
}

func (uc *whisperUseCase) ListByCurrentRelationship(ctx context.Context, userID primitive.ObjectID, limit, offset int64) ([]*dto.WhisperResponse, error) {
	log.Printf("[WHISPER][LIST_REL][START] user=%s", userID.Hex())
	rel, err := uc.relRepo.FindCurrentByUserID(ctx, userID)
	if err != nil {
		log.Printf("[WHISPER][LIST_REL][ERROR] user=%s no current relationship: %v", userID.Hex(), err)
		return nil, err
	}
	list, err := uc.repo.FindAllByRelationshipID(ctx, rel.ID, limit, offset)
	if err != nil {
		log.Printf("[WHISPER][LIST_REL][ERROR] user=%s err=%v", userID.Hex(), err)
		return nil, err
	}
	res := make([]*dto.WhisperResponse, 0, len(list))
	for _, w := range list {
		res = append(res, toWhisperResponse(w))
	}
	log.Printf("[WHISPER][LIST_REL][DONE] user=%s count=%d", userID.Hex(), len(res))
	return res, nil
}

func (uc *whisperUseCase) Update(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID, req *dto.UpdateWhisperRequest) (*dto.WhisperResponse, error) {
	log.Printf("[WHISPER][UPDATE][START] user=%s id=%s", userID.Hex(), id.Hex())
	w, err := uc.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	// Authorization: allow any partner in the same active relationship
	rel, err := uc.relRepo.FindCurrentByUserID(ctx, userID)
	if err != nil || rel.ID != w.RelationshipID {
		return nil, ErrForbidden
	}
	var dt time.Time
	if !req.Date.IsZero() {
		dt = req.Date
	}
	w.Update(req.Text, req.Recurrence, dt)
	if req.IsDone != nil {
		w.IsDone = *req.IsDone
		w.UpdatedAt = time.Now()
	}
	if err := uc.repo.Update(ctx, w); err != nil {
		return nil, err
	}
	log.Printf("[WHISPER][UPDATE][DONE] user=%s id=%s", userID.Hex(), id.Hex())
	return toWhisperResponse(w), nil
}

func (uc *whisperUseCase) Delete(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error {
	log.Printf("[WHISPER][DELETE][START] user=%s id=%s", userID.Hex(), id.Hex())
	w, err := uc.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	// Authorization: allow any partner in the same active relationship
	rel, err := uc.relRepo.FindCurrentByUserID(ctx, userID)
	if err != nil || rel.ID != w.RelationshipID {
		return ErrForbidden
	}
	if err := uc.repo.Delete(ctx, id); err != nil {
		return err
	}
	log.Printf("[WHISPER][DELETE][DONE] user=%s id=%s", userID.Hex(), id.Hex())
	return nil
}

// Convert a whisper into an Event for the current day, without asking for extra fields
func (uc *whisperUseCase) ConvertToEvent(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID, img *dto.EventImagePayload) (*dto.EventResponse, error) {
	log.Printf("[WHISPER][CONVERT][START] user=%s id=%s", userID.Hex(), id.Hex())
	w, err := uc.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	// Authorization: allow any partner in the same active relationship
	rel, err := uc.relRepo.FindCurrentByUserID(ctx, userID)
	if err != nil || rel.ID != w.RelationshipID {
		return nil, ErrForbidden
	}
	// Build event for today with whisper text as title
	now := time.Now()
	ev := entities.NewEvent(w.Text, entities.EventTypeDate, now, w.RelationshipID, userID)
	ev.Source = entities.EventSource{Type: entities.SourceTypeWhisperConverted}
	if img != nil && img.Type != "" {
		ev.Image = &entities.EventImage{
			Type:       img.Type,
			Data:       img.Data,
			Filename:   img.Filename,
			UploadedAt: time.Now(),
		}
	}
	if err := uc.eventRepo.Create(ctx, ev); err != nil {
		log.Printf("[WHISPER][CONVERT][ERROR] user=%s id=%s err=%v", userID.Hex(), id.Hex(), err)
		return nil, err
	}
	log.Printf("[WHISPER][CONVERT][DONE] user=%s id=%s event=%s", userID.Hex(), id.Hex(), ev.ID.Hex())
	return toEventResponse(ev), nil
}

// helpers
func toWhisperResponse(w *entities.Whisper) *dto.WhisperResponse {
	return &dto.WhisperResponse{
		ID:             w.ID.Hex(),
		Type:           w.Type,
		Text:           w.Text,
		Recurrence:     w.Recurrence,
		Date:           w.Date,
		RelationshipID: w.RelationshipID.Hex(),
		CreatedBy:      w.CreatedBy.Hex(),
		IsDone:         w.IsDone,
		CreatedAt:      w.CreatedAt,
		UpdatedAt:      w.UpdatedAt,
	}
}
