package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TransactionType string

const (
	TransactionTypeTopup    TransactionType = "topup"
	TransactionTypePurchase TransactionType = "purchase"
	TransactionTypeRefund   TransactionType = "refund"
)

type Transaction struct {
	ID          primitive.ObjectID  `bson:"_id,omitempty"          json:"id"`
	UserID      primitive.ObjectID  `bson:"user_id"                json:"user_id"`
	Type        TransactionType     `bson:"type"                   json:"type"`
	Amount      float64             `bson:"amount"                 json:"amount"`
	ReferenceID *primitive.ObjectID `bson:"reference_id,omitempty" json:"reference_id,omitempty"`
	CreatedAt   time.Time           `bson:"created_at"             json:"created_at"`
}
