package models

type Seller struct {
	Address     string  `json:"address" bson:"address"`
	TotalAmount float64 `json:"total_amount" bson:"totalamount"`
	Currency    float64 `json:"currency" bson:"currency"`
}

type BuySuggestion struct {
	SellerAddress    string  `json:"seller_address" bson:"selleraddress"`
	BuyerAddress     string  `json:"buyer_address" bson:"buyeraddress"`
	AmountSuggestion float64 `json:"amount_suggestion" bson:"amountsuggestion"`
}

type Deal struct {
	BuySuggestion BuySuggestion `json:"buy_suggestion" bson:"buySuggestion"`
	SessionId     int           `json:"session_id" bson:"sessionId"`
}
