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

type EventUseCase interface {
	RegisterEvent(ctx context.Context, userID primitive.ObjectID, req *dto.CreateEventRequest) (*dto.EventResponse, error)
	GetEventByID(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) (*dto.EventResponse, error)
	UpdateEventByID(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID, req *dto.UpdateEventRequest) (*dto.EventResponse, error)
	GetAllEventsByUserID(ctx context.Context, userID primitive.ObjectID, limit, offset int64) ([]*dto.EventResponse, error)
	GetAllEventsByCurrentRelationship(ctx context.Context, userID primitive.ObjectID, limit, offset int64) ([]*dto.EventResponse, error)
}

type eventUseCase struct {
	repo    domainRepos.EventRepository
	relRepo domainRepos.RelationshipRepository
	// could inject logger later; using std log for now
}

func NewEventUseCase(repo domainRepos.EventRepository, relRepo domainRepos.RelationshipRepository) EventUseCase {
	return &eventUseCase{repo: repo, relRepo: relRepo}
}

func (uc *eventUseCase) RegisterEvent(ctx context.Context, userID primitive.ObjectID, req *dto.CreateEventRequest) (*dto.EventResponse, error) {
	log.Printf("[EVENT][CREATE][START] user=%s title=%s type=%s", userID.Hex(), req.Title, req.Type)
	// Resolve current relationship for user
	rel, err := uc.relRepo.FindCurrentByUserID(ctx, userID)
	if err != nil {
		log.Printf("[EVENT][CREATE][ERROR] user=%s no current relationship: %v", userID.Hex(), err)
		return nil, err
	}
	ev := entities.NewEvent(req.Title, req.Type, req.Date, rel.ID, userID)
	ev.Description = req.Description

	if err := uc.repo.Create(ctx, ev); err != nil {
		log.Printf("[EVENT][CREATE][ERROR] user=%s err=%v", userID.Hex(), err)
		return nil, err
	}
	log.Printf("[EVENT][CREATE][DONE] user=%s event=%s", userID.Hex(), ev.ID.Hex())
	return toEventResponse(ev), nil
}

func (uc *eventUseCase) GetEventByID(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) (*dto.EventResponse, error) {
	log.Printf("[EVENT][GET][START] user=%s id=%s", userID.Hex(), id.Hex())
	ev, err := uc.repo.FindByID(ctx, id)
	if err != nil {
		log.Printf("[EVENT][GET][ERROR] user=%s id=%s err=%v", userID.Hex(), id.Hex(), err)
		return nil, err
	}
	// Authorization: creator or shared; for now allow creator only
	if ev.CreatedBy != userID {
		log.Printf("[EVENT][GET][DENY] user=%s id=%s", userID.Hex(), id.Hex())
		return nil, ErrForbidden
	}
	log.Printf("[EVENT][GET][DONE] user=%s id=%s", userID.Hex(), id.Hex())
	return toEventResponse(ev), nil
}

func (uc *eventUseCase) UpdateEventByID(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID, req *dto.UpdateEventRequest) (*dto.EventResponse, error) {
	log.Printf("[EVENT][UPDATE][START] user=%s id=%s", userID.Hex(), id.Hex())
	ev, err := uc.repo.FindByID(ctx, id)
	if err != nil {
		log.Printf("[EVENT][UPDATE][ERROR] find id=%s err=%v", id.Hex(), err)
		return nil, err
	}
	if ev.CreatedBy != userID {
		log.Printf("[EVENT][UPDATE][DENY] user=%s id=%s", userID.Hex(), id.Hex())
		return nil, ErrForbidden
	}

	// apply updates
	var newDate time.Time
	if !req.Date.IsZero() {
		newDate = req.Date
	}
	ev.Update(req.Title, req.Description, newDate, req.Type)

	if err := uc.repo.Update(ctx, ev); err != nil {
		log.Printf("[EVENT][UPDATE][ERROR] save id=%s err=%v", id.Hex(), err)
		return nil, err
	}
	log.Printf("[EVENT][UPDATE][DONE] user=%s id=%s", userID.Hex(), id.Hex())
	return toEventResponse(ev), nil
}

func (uc *eventUseCase) GetAllEventsByUserID(ctx context.Context, userID primitive.ObjectID, limit, offset int64) ([]*dto.EventResponse, error) {
	log.Printf("[EVENT][LIST][START] user=%s limit=%d offset=%d", userID.Hex(), limit, offset)
	events, err := uc.repo.FindAllByUserID(ctx, userID, limit, offset)
	if err != nil {
		log.Printf("[EVENT][LIST][ERROR] user=%s err=%v", userID.Hex(), err)
		return nil, err
	}
	res := make([]*dto.EventResponse, 0, len(events))
	for _, e := range events {
		res = append(res, toEventResponse(e))
	}
	log.Printf("[EVENT][LIST][DONE] user=%s count=%d", userID.Hex(), len(res))
	return res, nil
}

func (uc *eventUseCase) GetAllEventsByCurrentRelationship(ctx context.Context, userID primitive.ObjectID, limit, offset int64) ([]*dto.EventResponse, error) {
	log.Printf("[EVENT][LIST_REL][START] user=%s limit=%d offset=%d", userID.Hex(), limit, offset)
	rel, err := uc.relRepo.FindCurrentByUserID(ctx, userID)
	if err != nil {
		log.Printf("[EVENT][LIST_REL][ERROR] user=%s no current relationship: %v", userID.Hex(), err)
		return nil, err
	}
	events, err := uc.repo.FindAllByRelationshipID(ctx, rel.ID, limit, offset)
	if err != nil {
		log.Printf("[EVENT][LIST_REL][ERROR] user=%s err=%v", userID.Hex(), err)
		return nil, err
	}
	res := make([]*dto.EventResponse, 0, len(events))
	for _, e := range events {
		res = append(res, toEventResponse(e))
	}
	log.Printf("[EVENT][LIST_REL][DONE] user=%s count=%d", userID.Hex(), len(res))
	return res, nil
}

// helpers
func toEventResponse(ev *entities.Event) *dto.EventResponse {
	return &dto.EventResponse{
		ID:             ev.ID.Hex(),
		Title:          ev.Title,
		Description:    ev.Description,
		Date:           ev.Date,
		Type:           ev.Type,
		Category:       ev.Category,
		RelationshipID: ev.RelationshipID.Hex(),
		CreatedBy:      ev.CreatedBy.Hex(),
		IsPublic:       ev.Visibility.IsPublic,
		CreatedAt:      ev.CreatedAt,
		UpdatedAt:      ev.UpdatedAt,
	}
}

// common errors
var ErrForbidden = fmtError("forbidden")

type fmtError string

func (e fmtError) Error() string { return string(e) }
