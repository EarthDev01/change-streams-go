package repository

import (
	"changestreams/internal/model"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const collectionTransactions = "transactions"

type TransactionRepository interface {
	Create(ctx context.Context, tx *model.Transaction) error
}

type transactionRepository struct {
	db *mongo.Database
}

func NewTransactionRepository(db *mongo.Database) TransactionRepository {
	return &transactionRepository{db: db}
}

func (r *transactionRepository) Create(ctx context.Context, tx *model.Transaction) error {
	tx.ID = primitive.NewObjectID()
	tx.CreatedAt = time.Now()
	_, err := r.db.Collection(collectionTransactions).InsertOne(ctx, tx)
	return err
}
