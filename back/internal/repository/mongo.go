package repository

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
)

func InitMongo() (*mongo.Client, error) {
	connectionUrl := fmt.Sprintf("mongodb://%s:%s@%s:27017/?maxPoolSize=20&w=majority",
		os.Getenv("MONGO_USER"),
		os.Getenv("MONGO_PASS"),
		os.Getenv("MONGO_HOST"))
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(connectionUrl))
	return client, err
}
