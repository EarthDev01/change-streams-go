package service

import (
	"changestreams/db"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InitContext() (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithTimeout(context.Background(), 9999*time.Second)
	return ctx, cancel
}

func GetOneStatement(resource *db.Resource, collection string, filter interface{}, filterOption interface{}, data interface{}) error {
	ctx, cancel := InitContext()
	option := options.FindOne()
	option.SetSort(filterOption)
	defer cancel()
	err := resource.DB.Collection(collection).FindOne(ctx, filter, option).Decode(data)
	if err != nil {
		return err
	}
	return nil
}

func CreateOneStatement(resource *db.Resource, collection string, data interface{}) error {
	ctx, cancel := InitContext()
	defer cancel()
	_, err := resource.DB.Collection(collection).InsertOne(ctx, data)
	if err != nil {
		return err
	}
	return nil
}

func UpdateOneUpsertStatement(resource *db.Resource, collection string, filter interface{}, update interface{}) error {
	ctx, cancel := InitContext()
	defer cancel()
	_, err := resource.DB.Collection(collection).UpdateOne(ctx, filter, update, options.Update().SetUpsert(true))
	if err != nil {
		return err
	}
	return nil
}

func DeleteOneStatement(resource *db.Resource, collection string, filter interface{}) (*mongo.DeleteResult, error) {
	ctx, cancel := InitContext()
	defer cancel()
	obj, err := resource.DB.Collection(collection).DeleteOne(ctx, filter)
	if err != nil {
		return obj, err
	}
	return obj, nil
}
