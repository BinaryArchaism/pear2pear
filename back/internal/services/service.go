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
	ApproveSuggestion(ctx context.Context, buyerAddress string) (int, error) //sendOffer smart-contact function to call
	CreateSession(ctx context.Context, sessionId int64) error                //called after ApproveSuggestion to fix session in db. front should create Deal page
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

func (s *Service) ApproveSuggestion(ctx context.Context, buyerAddress string) (int, error) {
	//TODO implement me
	panic("implement me")
}

func (s *Service) CreateSession(ctx context.Context, sessionId int64) error {
	//TODO implement me
	panic("implement me")
}
