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
	CheckIfSuggestion(ctx context.Context, address string, isBuyer bool) (models.BuySuggestion, error)
	CreateSession(ctx context.Context, deal models.Deal) error //called after ApproveSuggestion to fix session in db. front should create Deal page

	GetSessionId(ctx context.Context, buySuggestion models.BuySuggestion) (int, error)
}

func NewRepository(mdb *mongo.Client) RepositoryInterface {
	return &Repository{mdb: mdb}
}

type Repository struct {
	mdb *mongo.Client
}

func (r *Repository) AddSellerToQueue(ctx context.Context, seller models.Seller) error {
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

func (r *Repository) GetSellerQueue(ctx context.Context) ([]models.Seller, error) {
	coll := r.mdb.Database("peear2pear").Collection("sellers_queue")
	cursor, err := coll.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	var sellersBson []bson.D
	if err = cursor.All(ctx, &sellersBson); err != nil {
		return nil, err
	}
	var sellers []models.Seller

	for i := range sellersBson {
		bsonBytes, _ := bson.Marshal(sellersBson[i])
		var seller models.Seller
		err = bson.Unmarshal(bsonBytes, &seller)
		if err != nil {
			return nil, err
		}
		sellers = append(sellers, seller)
	}
	return sellers, nil
}

func (r *Repository) SendBuySuggestion(ctx context.Context, buySuggestion models.BuySuggestion) error {
	coll := r.mdb.Database("peear2pear").Collection("buy_suggestion")
	doc, err := bson.Marshal(buySuggestion)
	if err != nil {
		return err
	}
	_, err = coll.InsertOne(ctx, doc)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) CheckIfSuggestion(ctx context.Context, address string, isBuyer bool) (models.BuySuggestion, error) {
	coll := r.mdb.Database("peear2pear").Collection("buy_suggestion")
	var buySuggestion models.BuySuggestion
	err := coll.FindOne(ctx, bson.D{
		{
			"selleraddress", address,
		},
	}).Decode(&buySuggestion)
	if err != nil {
		err1 := coll.FindOne(ctx, bson.D{
			{
				"buyeraddress", address,
			},
		}).Decode(&buySuggestion)
		if err1 != nil {
			return models.BuySuggestion{}, err
		}
	}
	return buySuggestion, nil
}

func (r *Repository) CreateSession(ctx context.Context, deal models.Deal) error {
	coll := r.mdb.Database("peear2pear").Collection("deals")
	doc, err := bson.Marshal(deal)
	if err != nil {
		return err
	}
	_, err = coll.InsertOne(ctx, doc)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) GetSessionId(ctx context.Context, buySuggestion models.BuySuggestion) (int, error) {
	coll := r.mdb.Database("peear2pear").Collection("deals")
	var deal models.Deal
	err := coll.FindOne(ctx, bson.D{
		{
			"buySuggestion", buySuggestion,
		},
	}).Decode(&deal)
	if err != nil {
		return -1, nil
	}
	return deal.SessionId, nil
}
