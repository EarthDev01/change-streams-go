package controller

import (
	"changestreams/db"
	"changestreams/helper"
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func WatchCollection(resources db.Resources) error {
	ctx := context.Background()
	resourceMain := resources["main"]
	resourceSub := resources["sub"]

	// collection ที่ต้องการติดตามการเปลี่่ยนแปลง
	mainCollection := resourceMain.DB.Collection("username")
	nameCollection := mainCollection.Name()

	// setup pipeline
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "operationType", Value: bson.D{{Key: "$in", Value: bson.A{"insert", "update", "replace", "delete"}}}}}}},
	}
	// pipeline := mongo.Pipeline{}
	streamOpts := options.ChangeStream().
		SetFullDocument(options.UpdateLookup).
		SetMaxAwaitTime(2 * time.Second)

	// ดึง token จาก db
	token, lastUpdatedAt := LoadResumeToken(resourceSub, nameCollection)
	if token != nil {
		// ตั้งค่า token ให้กับ streamOpts
		streamOpts.SetResumeAfter(token)
		fmt.Printf("Resuming from previous token (updated_at=%s)\n", lastUpdatedAt.Format(time.RFC3339))
	}

	// สร้าง change stream
	changeStream, err := mainCollection.Watch(ctx, pipeline, streamOpts)
	if err != nil {
		return fmt.Errorf("watch collection %q: %w", nameCollection, err)
	}
	defer changeStream.Close(ctx)

	// ดึง event จาก change stream
	for changeStream.Next(ctx) {
		var event bson.M
		if err := changeStream.Decode(&event); err != nil {
			return fmt.Errorf("decode collection change event: %w", err)
		}

		// ประมวลผล event
		if err := ProcessChangeEvent(event, resourceSub); err != nil {
			fmt.Printf("Error processing change event: %v\n", err)
			continue
		}

		// บันทึก token จาก change stream
		SaveResumeToken(resourceSub, nameCollection, changeStream.ResumeToken())

	}

	// ถ้ามี error ให้ return error
	if err := changeStream.Err(); err != nil {
		return fmt.Errorf("collection change stream cursor error: %w", err)
	}

	fmt.Println("collection change stream stopped", "database", mainCollection.Database().Name(), "collection", mainCollection.Name())
	return nil
}

func ProcessChangeEvent(event bson.M, resource *db.Resource) error {

	// ดึงประเภทการดำเนินการ Insert Update Replace Delete
	typeOperation := event["operationType"]
	document := event["fullDocument"].(bson.M)

	fmt.Printf("operationType: %s ,fullDocument: %s documentKey: %s clusterTime: %s ns: %s\n",
		event["operationType"], // ประเภทการดำเนินการ
		event["documentKey"],   // คีย์ของ document
		event["clusterTime"],   // วันที่การดำเนินการ
		helper.ColorOperation("blue", event["fullDocument"]), // ข้อมูลของ document
		helper.ColorOperation("yellow", event["ns"]),         // ns: database.collection
	)

	switch typeOperation {
	case "insert":
		fmt.Println(helper.ColorOperation("green", typeOperation), "Insert event")

		err := UpdateMainUsernamesToSub(resource, document)
		if err != nil {
			return fmt.Errorf("update main usernames to sub: %w", err)
		}

		return nil
	case "update":
		fmt.Println(helper.ColorOperation("blue", typeOperation), "Update event")
	case "replace":
		fmt.Println(helper.ColorOperation("magenta", typeOperation), "Replace event")
	case "delete":
		fmt.Println(helper.ColorOperation("red", typeOperation), "Delete event")
	default:
		fmt.Println(helper.ColorOperation("yellow", typeOperation), "Unknown event")
	}
	return nil
}
