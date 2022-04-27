package main

import (
	"github.com/BinaryArchaism/pear2pear/back/internal/handlers"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	handler := handlers.NewHandler(app)

}
