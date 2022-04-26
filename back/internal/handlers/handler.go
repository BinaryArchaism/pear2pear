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
	CreateSession(sessionId int64) error
}

type handler struct {
	App fiber.App
}

func NewHandler(app fiber.App) HandlerInterface {
	return handler{App: app}
}
