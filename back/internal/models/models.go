package models

type Seller struct {
	Address     string  `json:"address"`
	TotalAmount float64 `json:"total_amount"`
	Currency    float64 `json:"currency"`
}

type BuySuggestion struct {
	SellerAddress    string  `json:"seller_address"`
	BuyerAddress     string  `json:"buyer_address"`
	AmountSuggestion float64 `json:"amount_suggestion"`
}
