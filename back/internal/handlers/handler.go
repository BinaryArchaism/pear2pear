package handlers

import (
	"github.com/BinaryArchaism/pear2pear/back/internal/models"
	"github.com/BinaryArchaism/pear2pear/back/internal/services"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"net/http"
)

type HandlerInterface interface {
	AddSellerToQueue(c *fiber.Ctx) error
	GetSellerQueue(c *fiber.Ctx) error

	SendBuySuggestion(c *fiber.Ctx) error
	ApproveSuggestion(c *fiber.Ctx) error //sendOffer smart-contact function to call
	CreateSession(c *fiber.Ctx) error     //called after ApproveSuggestion to fix session in db. front should create Deal page

	Ping(c *fiber.Ctx) error

	StartApp() error
}

func NewHandler(service services.ServiceInterface) HandlerInterface {
	router := &handler{app: fiber.New(), service: service}
	router.app.Post("/add_seller_to_queue", router.AddSellerToQueue)
	router.app.Get("/get_sellers_queue", router.GetSellerQueue)

	router.app.Post("/send_buy_suggestion", router.SendBuySuggestion)
	router.app.Post("/approve_suggestion", router.ApproveSuggestion)
	router.app.Post("/create_session", router.CreateSession)

	router.app.Get("/ping", router.Ping)

	router.app.Use(logger.New(logger.Config{
		Format:     "${port} ${status} - ${method} ${path}\n${reqHeader}",
		TimeFormat: "02-Jan-2006",
		TimeZone:   "Europe/Moscow",
	}))
	router.app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "*",
		AllowHeaders:     "Accept, Content-Type, Access-Control-Allow-Origin, Origin",
		AllowMethods:     "GET,POST",
	}))

	return router
}

type handler struct {
	app     *fiber.App
	service services.ServiceInterface
}

func (h *handler) Ping(c *fiber.Ctx) error {
	return c.SendStatus(http.StatusOK)
}

func (h *handler) StartApp() error {
	return h.app.Listen(":8080")
}

func (h *handler) AddSellerToQueue(c *fiber.Ctx) error {
	var seller models.Seller
	if err := c.BodyParser(&seller); err != nil {
		return err
	}
	if err := h.service.AddSellerToQueue(c.Context(), seller); err != nil {
		return err
	}
	return c.SendStatus(http.StatusOK)
}

func (h *handler) GetSellerQueue(c *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}

func (h *handler) SendBuySuggestion(c *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}

func (h *handler) ApproveSuggestion(c *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}

func (h *handler) CreateSession(c *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}
