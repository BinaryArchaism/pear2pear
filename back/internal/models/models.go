package models

type Seller struct {
	Address     string  `json:"address"`
	TotalAmount float64 `json:"total_amount"`
	Currency    float64 `json:"currency"`
}
