package repository

import (
	"changestreams/internal/model"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const collectionUsers = "users"

type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	FindByID(ctx context.Context, id primitive.ObjectID) (*model.User, error)
	Create(ctx context.Context, user *model.User) error
	IncrementCredit(ctx context.Context, userID primitive.ObjectID, amount float64) error
}

type userRepository struct {
	db *mongo.Database
}

func NewUserRepository(db *mongo.Database) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	if err := r.db.Collection(collectionUsers).FindOne(ctx, bson.M{"email": email}).Decode(&user); err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.User, error) {
	var user model.User
	if err := r.db.Collection(collectionUsers).FindOne(ctx, bson.M{"_id": id}).Decode(&user); err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Create(ctx context.Context, user *model.User) error {
	user.ID = primitive.NewObjectID()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	_, err := r.db.Collection(collectionUsers).InsertOne(ctx, user)
	return err
}

func (r *userRepository) IncrementCredit(ctx context.Context, userID primitive.ObjectID, amount float64) error {
	filter := bson.M{"_id": userID}
	update := bson.M{
		"$inc": bson.M{"credit_balance": amount},
		"$set": bson.M{"updated_at": time.Now()},
	}
	_, err := r.db.Collection(collectionUsers).UpdateOne(ctx, filter, update, options.Update().SetUpsert(false))
	return err
}
