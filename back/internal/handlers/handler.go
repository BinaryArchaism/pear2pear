package handlers

import (
	"github.com/BinaryArchaism/pear2pear/back/internal/models"
	"github.com/gofiber/fiber/v2"
)

type HandlerInterface interface {
	AddSellerToQueue(address string, totalAmount float64, currency float64) error
	GetSellerQueue() []models.Seller

	SendBuySuggestion(sellerAddress, buyerAddress string, amountSuggestion float64) error
	ApproveSuggestion(buyerAddress string) (int, error) //sendOffer smart-contact function to call
	CreateSession(sessionId int64) error                //called after ApproveSuggestion to fix session in db. front should create Deal page
}

func NewHandler(app *fiber.App) HandlerInterface {
	return &handler{App: app}
}

type handler struct {
	App *fiber.App
}

func (h *handler) AddSellerToQueue(address string, totalAmount float64, currency float64) error {
	//TODO implement me
	panic("implement me")
}

func (h *handler) GetSellerQueue() []models.Seller {
	//TODO implement me
	panic("implement me")
}

func (h *handler) SendBuySuggestion(sellerAddress, buyerAddress string, amountSuggestion float64) error {
	//TODO implement me
	panic("implement me")
}

func (h *handler) ApproveSuggestion(buyerAddress string) (int, error) {
	//TODO implement me
	panic("implement me")
}

func (h *handler) CreateSession(sessionId int64) error {
	//TODO implement me
	panic("implement me")
}
