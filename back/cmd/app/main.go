package main

import (
	"github.com/BinaryArchaism/pear2pear/back/internal/handlers"
	"github.com/BinaryArchaism/pear2pear/back/internal/repository"
	"github.com/BinaryArchaism/pear2pear/back/internal/services"
	"github.com/joho/godotenv"
	"log"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	mdb, err := repository.InitMongo()
	if err != nil {
		log.Fatalf("Error creating mongo: %e", err)
	}

	repo := repository.NewRepository(mdb)
	service := services.NewService(repo)
	handler := handlers.NewHandler(service)

	log.Fatal(handler.StartApp())
}
