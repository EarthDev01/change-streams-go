package db

import (
	"changestreams/internal/config"
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/avast/retry-go"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const connectTimeout = 30 * time.Second

// Resource holds a connected MongoDB database.
type Resource struct {
	DB *mongo.Database
}

// Resources holds all database connections for the application.
type Resources struct {
	Main *Resource
	Sub  *Resource
}

// Close gracefully disconnects all MongoDB clients.
func (r *Resources) Close() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := r.Main.DB.Client().Disconnect(ctx); err != nil {
		slog.Error("failed to disconnect main db", "error", err)
	}
	if err := r.Sub.DB.Client().Disconnect(ctx); err != nil {
		slog.Error("failed to disconnect sub db", "error", err)
	}
}

// Connect establishes connections to all configured MongoDB databases with retry.
func Connect(cfg *config.Config) (*Resources, error) {
	main, err := connectWithRetry(cfg.MongoURIMain, cfg.MongoNameMain)
	if err != nil {
		return nil, fmt.Errorf("connect main db: %w", err)
	}

	return &Resources{Main: main}, nil
}

func connectWithRetry(uri, dbName string) (*Resource, error) {
	var resource *Resource

	err := retry.Do(
		func() error {
			r, err := createResource(uri, dbName)
			resource = r
			return err
		},
		retry.Delay(2*time.Second),
		retry.Attempts(10),
		retry.DelayType(retry.FixedDelay),
		retry.OnRetry(func(n uint, err error) {
			slog.Warn("retrying db connection", "attempt", n+1, "db_name", dbName, "error", err)
		}),
	)

	return resource, err
}

func createResource(uri, dbName string) (*Resource, error) {
	if uri == "" {
		return nil, errors.New("mongodb uri is empty")
	}
	if dbName == "" {
		return nil, errors.New("mongodb database name is empty")
	}

	clientOpts := options.Client().
		ApplyURI(uri).
		SetMinPoolSize(1).
		SetMaxPoolSize(30)

	client, err := mongo.NewClient(clientOpts)
	if err != nil {
		return nil, fmt.Errorf("create client: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), connectTimeout)
	defer cancel()

	if err := client.Connect(ctx); err != nil {
		return nil, fmt.Errorf("connect: %w", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("ping: %w", err)
	}

	return &Resource{DB: client.Database(dbName)}, nil
}
