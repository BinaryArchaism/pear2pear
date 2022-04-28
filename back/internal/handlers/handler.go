package handlers

import (
	"fmt"
	"github.com/BinaryArchaism/pear2pear/back/internal/models"
	"github.com/BinaryArchaism/pear2pear/back/internal/services"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"net/http"
	"strconv"
	"strings"
)

type HandlerInterface interface {
	AddSellerToQueue(c *fiber.Ctx) error
	GetSellerQueue(c *fiber.Ctx) error

	SendBuySuggestion(c *fiber.Ctx) error
	CheckIfSuggestion(c *fiber.Ctx) error
	CreateSession(c *fiber.Ctx) error //called after ApproveSuggestion to fix session in db. front should create Deal page

	GetSessionId(c *fiber.Ctx) error

	Ping(c *fiber.Ctx) error

	StartApp() error
}

func NewHandler(service services.ServiceInterface) HandlerInterface {
	router := &handler{app: fiber.New(), service: service}
	router.app.Post("/add_seller_to_queue", router.AddSellerToQueue)
	router.app.Get("/get_sellers_queue", router.GetSellerQueue)

	router.app.Post("/send_buy_suggestion", router.SendBuySuggestion)
	router.app.Post("/check_if_suggestion", router.CheckIfSuggestion)
	router.app.Post("/create_session", router.CreateSession)

	router.app.Post("/get_session_id", router.GetSessionId)

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
	queue, err := h.service.GetSellerQueue(c.Context())
	if err != nil {
		return err
	}
	return c.JSON(queue)
}

func (h *handler) SendBuySuggestion(c *fiber.Ctx) error {
	var buySuggestion models.BuySuggestion
	if err := c.BodyParser(&buySuggestion); err != nil {
		return err
	}
	if err := h.service.SendBuySuggestion(c.Context(), buySuggestion); err != nil {
		return err
	}
	return c.SendStatus(http.StatusOK)
}

func (h *handler) CheckIfSuggestion(c *fiber.Ctx) error {
	address := struct {
		Address string `json:"address"`
		IsBuyer bool   `json:"is_buyer"`
	}{}
	if err := c.BodyParser(&address); err != nil {
		return err
	}
	queue, err := h.service.CheckIfSuggestion(c.Context(), address.Address, address.IsBuyer)
	if err != nil {
		return err
	}
	return c.JSON(queue)
}

func (h *handler) CreateSession(c *fiber.Ctx) error {
	fmt.Println(string(c.Body()))
	strDeal := struct {
		BuySuggestion models.BuySuggestion `json:"buy_suggestion" bson:"buySuggestion"`
		SessionId     struct {
			Type string `json:"type"`
			Hex  string `json:"hex"`
		} `json:"session_id" bson:"sessionId"`
	}{}
	var deal models.Deal
	if err := c.BodyParser(&strDeal); err != nil {
		return err
	}
	deal.BuySuggestion = strDeal.BuySuggestion
	var err error
	deal.SessionId, err = strconv.Atoi(strings.Split(strDeal.SessionId.Hex, "x")[1])
	if err != nil {
		return err
	}
	if err := h.service.CreateSession(c.Context(), deal); err != nil {
		return err
	}
	return c.SendStatus(http.StatusOK)
}

func (h *handler) GetSessionId(c *fiber.Ctx) error {
	var buySuggestion models.BuySuggestion
	if err := c.BodyParser(&buySuggestion); err != nil {
		return err
	}
	sessionId, err := h.service.GetSessionId(c.Context(), buySuggestion)
	if err != nil {
		return err
	}
	return c.JSON(sessionId)
}
