package main

import (
	"changestreams/internal/server"
	"log/slog"
	"os"
)

func main() {
	if err := server.Run(); err != nil {
		slog.Error("server terminated with error", "error", err)
		os.Exit(1)
	}
}
