package services

import (
	"context"
	"github.com/BinaryArchaism/pear2pear/back/internal/models"
	"github.com/BinaryArchaism/pear2pear/back/internal/repository"
)

type ServiceInterface interface {
	AddSellerToQueue(ctx context.Context, seller models.Seller) error
	GetSellerQueue(ctx context.Context) ([]models.Seller, error)

	SendBuySuggestion(ctx context.Context, buySuggestion models.BuySuggestion) error
	CheckIfSuggestion(ctx context.Context, address string, isBuyer bool) (models.BuySuggestion, error)
	CreateSession(ctx context.Context, deal models.Deal) error //called after ApproveSuggestion to fix session in db. front should create Deal page

	GetSessionId(ctx context.Context, buySuggestion models.BuySuggestion) (int, error)
}

func NewService(repository repository.RepositoryInterface) ServiceInterface {
	return &Service{repository: repository}
}

type Service struct {
	repository repository.RepositoryInterface
}

func (s *Service) AddSellerToQueue(ctx context.Context, seller models.Seller) error {
	return s.repository.AddSellerToQueue(ctx, seller)
}

func (s *Service) GetSellerQueue(ctx context.Context) ([]models.Seller, error) {
	return s.repository.GetSellerQueue(ctx)
}

func (s *Service) SendBuySuggestion(ctx context.Context, buySuggestion models.BuySuggestion) error {
	return s.repository.SendBuySuggestion(ctx, buySuggestion)
}

func (s *Service) CheckIfSuggestion(ctx context.Context, address string, isBuyer bool) (models.BuySuggestion, error) {
	return s.repository.CheckIfSuggestion(ctx, address, isBuyer)
}

func (s *Service) CreateSession(ctx context.Context, deal models.Deal) error {
	return s.repository.CreateSession(ctx, deal)
}

func (s *Service) GetSessionId(ctx context.Context, buySuggestion models.BuySuggestion) (int, error) {
	return s.repository.GetSessionId(ctx, buySuggestion)
}
