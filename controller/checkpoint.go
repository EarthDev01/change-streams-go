package controller

import (
	"changestreams/db"
	"changestreams/service"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	codeFailedToParse          = 9
	codeInvalidUUID            = 207
	codeCursorKilled           = 237
	codeInvalidResumeToken     = 260
	codeChangeStreamFatalError = 280
	codeHistoryLost            = 286
	codeNoToken                = 40649
	codeLocation               = 50811
	codeDuplicateKey           = 58010
)

var resumeTokenInvalidCodes = map[int32]struct{}{
	codeFailedToParse:          {},
	codeInvalidUUID:            {},
	codeCursorKilled:           {},
	codeInvalidResumeToken:     {},
	codeChangeStreamFatalError: {},
	codeHistoryLost:            {},
	codeNoToken:                {},
	codeLocation:               {},
	codeDuplicateKey:           {},
}

func ResumeTokenInvalid(err error) bool {
	if err == nil {
		return false
	}
	var ce mongo.CommandError
	if errors.As(err, &ce) {
		fmt.Printf("ResumeTokenInvalid: code=%d name=%s \n", ce.Code, ce.Name)
		if _, ok := resumeTokenInvalidCodes[ce.Code]; ok {
			return true
		}
	}
	return false
}

func checkpointName(collection string) string {
	return collection + "_watch"
}

func LoadResumeToken(resource *db.Resource, collection string) (bson.Raw, time.Time) {
	var result struct {
		Token     bson.Raw  `bson:"token"`
		UpdatedAt time.Time `bson:"updated_at"`
	}
	err := service.GetOneStatement(resource, "watch_checkpoints", bson.M{"name": checkpointName(collection)}, nil, &result)
	if err != nil {
		return nil, time.Time{}
	}

	return result.Token, result.UpdatedAt
}

func SaveResumeToken(resource *db.Resource, collection string, token bson.Raw) {
	err := service.UpdateOneUpsertStatement(resource, "watch_checkpoints",
		bson.M{"name": checkpointName(collection)},
		bson.M{"$set": bson.M{"token": token, "updated_at": time.Now()}},
	)
	if err != nil {
		fmt.Println("SaveResumeToken error", err)
	}
}

func ClearResumeToken(resource *db.Resource, collection string) {
	_, err := service.DeleteOneStatement(resource, "watch_checkpoints", bson.M{"name": checkpointName(collection)})
	if err != nil {
		fmt.Println("ClearResumeToken error", err)
	}
}
