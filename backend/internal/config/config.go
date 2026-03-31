package config

import (
	"errors"
	"os"
)

// Config holds all application configuration loaded from environment variables.
type Config struct {
	MongoURIMain  string
	MongoNameMain string
	ServerAddr    string
}

// Load reads configuration from environment variables and validates required fields.
func Load() (*Config, error) {
	cfg := &Config{
		MongoURIMain:  os.Getenv("MONGODB_ENDPOINT_MAIN"),
		MongoNameMain: os.Getenv("MONGODB_NAME_MAIN"),
		ServerAddr:    os.Getenv("SERVER_ADDR"),
	}

	if cfg.ServerAddr == "" {
		cfg.ServerAddr = ":8888"
	}

	return cfg, cfg.validate()
}

func (c *Config) validate() error {
	if c.MongoURIMain == "" {
		return errors.New("MONGODB_ENDPOINT_MAIN is required")
	}
	if c.MongoNameMain == "" {
		return errors.New("MONGODB_NAME_MAIN is required")
	}
	return nil
}
