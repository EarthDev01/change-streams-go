package db

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/avast/retry-go"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	connectTimeout = 60
)

type Resource struct {
	DB        *mongo.Database
	DBReport  *mongo.Database
	DBArchive *mongo.Database
}

type Resources map[string]*Resource

func (r *Resource) Close() {
	ctx, cancel := InitContext()
	defer cancel()
	if err := r.DB.Client().Disconnect(ctx); err != nil {
		fmt.Println("failed to disconnect mongodb", err)
		return
	}
	fmt.Println("disconnected mongodb successfully")
}

func InitContext() (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithTimeout(context.Background(), connectTimeout*time.Second)
	return ctx, cancel
}

func CreateResource(uri string, dbName string) (*Resource, error) {
	if uri == "" {
		return nil, errors.New("mongodb endpoint lost")
	}

	if dbName == "" {
		return nil, errors.New("database name is empty")
	}

	client, err := mongo.NewClient(
		options.Client().ApplyURI(uri),
		options.Client().SetMinPoolSize(1),
		options.Client().SetMaxPoolSize(30),
	)

	if err != nil {
		logrus.Errorf("Failed to create client: %v", err)
		return nil, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), connectTimeout*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		logrus.Errorf("Failed to connect to server: %v", err)
		return nil, err
	}
	err = client.Ping(ctx, nil)
	if err != nil {
		logrus.Errorf("Failed to ping cluster: %v", err)
		return nil, err
	}

	db := client.Database(dbName)
	if db.Name() == "" {
		return nil, errors.New("database name is empty")
	}

	return &Resource{DB: db}, nil
}

func ConnectDbs() (Resources, error) {
	resources := make(Resources)

	dbNameMain := os.Getenv("MONGODB_NAME_MAIN")
	dbNameSub := os.Getenv("MONGODB_NAME_SUB")

	if dbNameSub == "" || dbNameMain == "" {
		fmt.Println("dbNameMain", dbNameMain, "dbNameSub", dbNameSub)
		return nil, errors.New("database name is empty")
	}

	resourceMain, err := ConnectRetry(os.Getenv("MONGODB_ENDPOINT_MAIN"), dbNameMain)
	if err != nil {
		fmt.Println("Connection database failure, Please check connection main")
		fmt.Println(err.Error())
		logrus.Error(err)
		return nil, err
	}

	resourceSub, err := ConnectRetry(os.Getenv("MONGODB_ENDPOINT_SUB"), dbNameSub)
	if err != nil {
		fmt.Println("Connection database failure, Please check connection sub")
		fmt.Println(err.Error())
		logrus.Error(err)
		return nil, err
	}

	resources["main"] = resourceMain
	resources["sub"] = resourceSub
	return resources, nil
}

func ConnectRetry(uri string, dbName string) (*Resource, error) {
	var resource *Resource

	if err := retry.Do(
		func() error {
			resourceTmp, err := CreateResource(uri, dbName)
			resource = resourceTmp
			return err
		},
		retry.Delay(2*time.Second),
		retry.Attempts(9999),
		retry.DelayType(retry.FixedDelay),
		retry.OnRetry(func(n uint, err error) {
			fmt.Printf("Retry #%d: %s\n", n, err)
		}),
	); err != nil {
		fmt.Println("Connection database failure, Please check connection", err)
	}
	return resource, nil
}
