package repository

import (
	"context"
	"github.com/BinaryArchaism/pear2pear/back/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepositoryInterface interface {
	AddSellerToQueue(ctx context.Context, seller models.Seller) error
	GetSellerQueue(ctx context.Context) ([]models.Seller, error)

	SendBuySuggestion(ctx context.Context, buySuggestion models.BuySuggestion) error
	ApproveSuggestion(ctx context.Context, buyerAddress string) (int, error) //sendOffer smart-contact function to call
	CreateSession(ctx context.Context, sessionId int64) error                //called after ApproveSuggestion to fix session in db. front should create Deal page
}

func NewRepository(mdb *mongo.Client) RepositoryInterface {
	return Repository{mdb: mdb}
}

type Repository struct {
	mdb *mongo.Client
}

func (r Repository) AddSellerToQueue(ctx context.Context, seller models.Seller) error {
	coll := r.mdb.Database("peear2pear").Collection("sellers_queue")
	doc, err := bson.Marshal(seller)
	if err != nil {
		return err
	}
	_, err = coll.InsertOne(ctx, doc)
	if err != nil {
		return err
	}
	return nil
}

func (r Repository) GetSellerQueue(ctx context.Context) ([]models.Seller, error) {
	//TODO implement me
	panic("implement me")
}

func (r Repository) SendBuySuggestion(ctx context.Context, buySuggestion models.BuySuggestion) error {
	//TODO implement me
	panic("implement me")
}

func (r Repository) ApproveSuggestion(ctx context.Context, buyerAddress string) (int, error) {
	//TODO implement me
	panic("implement me")
}

func (r Repository) CreateSession(ctx context.Context, sessionId int64) error {
	//TODO implement me
	panic("implement me")
}
