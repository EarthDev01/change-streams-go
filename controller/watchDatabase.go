package controller

import (
	"changestreams/helper"
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func WatchDatabase(db *mongo.Database) error {
	// Database watch receives changes from all collections in this database.
	ctx := context.Background()

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "operationType", Value: bson.D{{Key: "$in", Value: bson.A{"insert", "update", "replace", "delete", "drop", "rename"}}}}}}},
	}

	streamOpts := options.ChangeStream().
		SetFullDocument(options.UpdateLookup).
		SetMaxAwaitTime(2 * time.Second)

	changeStream, err := db.Watch(ctx, pipeline, streamOpts)
	if err != nil {
		return fmt.Errorf("watch database %q: %w", db.Name(), err)
	}
	defer changeStream.Close(ctx)

	for changeStream.Next(ctx) {
		var event bson.M
		if err := changeStream.Decode(&event); err != nil {
			return fmt.Errorf("decode database change event: %w", err)
		}

		ns, _ := event["ns"].(bson.M)
		fmt.Println(
			"database change event", // ประเภทการดำเนินการ
			"database", db.Name(),   // ฐานข้อมูล
			"operation_type", event["operationType"], // ประเภทการดำเนินการ
			"document_key", event["documentKey"], // คีย์ของ document
			"collection", helper.ColorOperation("yellow", ns["coll"]), // ชื่อ collection
			"full_document", helper.ColorOperation("blue", event["fullDocument"]), // ข้อมูลของ document
		)
	}

	if err := changeStream.Err(); err != nil {
		return fmt.Errorf("database change stream cursor error: %w", err)
	}

	fmt.Println("database change stream stopped", "database", db.Name())
	return nil
}
