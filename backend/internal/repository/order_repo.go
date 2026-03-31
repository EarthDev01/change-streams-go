package repository

import (
	"changestreams/internal/model"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const collectionOrders = "orders"

type OrderRepository interface {
	Create(ctx context.Context, order *model.Order) error
	FindByID(ctx context.Context, id primitive.ObjectID) (*model.Order, error)
	UpdateStatus(ctx context.Context, id primitive.ObjectID, status model.OrderStatus) error
	FindByStatus(ctx context.Context, status model.OrderStatus) ([]model.Order, error)
	FindByUserID(ctx context.Context, userID primitive.ObjectID) ([]model.Order, error)
}

type orderRepository struct {
	db *mongo.Database
}

func NewOrderRepository(db *mongo.Database) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(ctx context.Context, order *model.Order) error {
	order.ID = primitive.NewObjectID()
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()
	_, err := r.db.Collection(collectionOrders).InsertOne(ctx, order)
	return err
}

func (r *orderRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Order, error) {
	var order model.Order
	if err := r.db.Collection(collectionOrders).FindOne(ctx, bson.M{"_id": id}).Decode(&order); err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) UpdateStatus(ctx context.Context, id primitive.ObjectID, status model.OrderStatus) error {
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"status":     status,
			"updated_at": time.Now(),
		},
	}
	_, err := r.db.Collection(collectionOrders).UpdateOne(ctx, filter, update)
	return err
}

func (r *orderRepository) FindByStatus(ctx context.Context, status model.OrderStatus) ([]model.Order, error) {
	cursor, err := r.db.Collection(collectionOrders).Find(ctx, bson.M{"status": status})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var orders []model.Order
	if err := cursor.All(ctx, &orders); err != nil {
		return nil, err
	}
	return orders, nil
}

func (r *orderRepository) FindByUserID(ctx context.Context, userID primitive.ObjectID) ([]model.Order, error) {
	cursor, err := r.db.Collection(collectionOrders).Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var orders []model.Order
	if err := cursor.All(ctx, &orders); err != nil {
		return nil, err
	}
	return orders, nil
}
