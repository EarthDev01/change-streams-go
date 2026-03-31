package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderStatus string

const (
	OrderStatusPending         OrderStatus = "pending"
	OrderStatusApproved        OrderStatus = "approved"
	OrderStatusRejected        OrderStatus = "rejected"
	OrderStatusRefundRequested OrderStatus = "refund_requested"
	OrderStatusRefunded        OrderStatus = "refunded"
)

type Order struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id"       json:"user_id"`
	PackageID primitive.ObjectID `bson:"package_id"    json:"package_id"`
	Amount    float64            `bson:"amount"        json:"amount"`
	Status    OrderStatus        `bson:"status"        json:"status"`
	Note      string             `bson:"note,omitempty" json:"note,omitempty"`
	CreatedAt time.Time          `bson:"created_at"    json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at"    json:"updated_at"`
}
