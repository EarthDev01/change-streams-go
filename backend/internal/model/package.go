package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Package struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name"          json:"name"`
	Description string             `bson:"description"   json:"description"`
	Price       float64            `bson:"price"         json:"price"`
	IsActive    bool               `bson:"is_active"     json:"is_active"`
	CreatedBy   primitive.ObjectID `bson:"created_by"    json:"created_by"`
	CreatedAt   time.Time          `bson:"created_at"    json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at"    json:"updated_at"`
}
