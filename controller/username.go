package controller

import (
	"changestreams/db"
	"changestreams/helper"
	"changestreams/service"
	"errors"
	"fmt"
	"sync/atomic"
	"time"

	"github.com/fatih/color"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
)

func SeedMainUsernamesMain() {
	_ = godotenv.Load()

	resources, err := db.ConnectDbs()
	if err != nil {
		time.Sleep(5 * time.Second)
		color.Red("Restart", err)
		return
	}

	if err := SeedMainUsernames(resources["main"]); err != nil {
		color.Red("SeedMainUsernames: %v", err)
	} else {
		color.Green("SeedMainUsernames: inserted 10000 documents into collection username")
	}
}

const (
	usernameSeedTotal    = 10000
	usernameSeedInterval = 500 * time.Millisecond
)

var usernameSeedRunning atomic.Bool

func SeedMainUsernames(resource *db.Resource) error {
	if resource == nil || resource.DB == nil {
		return errors.New("main resource is nil")
	}

	if !usernameSeedRunning.CompareAndSwap(false, true) {
		return errors.New("username seeding already running")
	}
	defer usernameSeedRunning.Store(false)

	collection := resource.DB.Collection("username")

	for id := 1; id <= usernameSeedTotal; id++ {
		username := fmt.Sprintf("username%d", id)

		err := service.CreateOneStatement(
			resource, "username",
			bson.M{"id": id, "username": username},
		)
		if err != nil {
			return fmt.Errorf("create username id=%d: %w", id, err)
		}

		if id < usernameSeedTotal {
			time.Sleep(usernameSeedInterval)
		}

		fmt.Println(
			"seed username completed",
			"database", resource.DB.Name(),
			"collection", collection.Name(),
			helper.ColorOperation("green", id),
			helper.ColorOperation("blue", username),
			helper.ColorOperation("magenta", usernameSeedTotal),
		)
	}

	return nil
}

func UpdateMainUsernamesToSub(resource *db.Resource, doc bson.M) error {
	if resource == nil || resource.DB == nil {
		return errors.New("main resource is nil")
	}

	err := service.CreateOneStatement(resource, "username", doc)
	if err != nil {
		return fmt.Errorf("create username: %w", err)
	}

	return nil
}
