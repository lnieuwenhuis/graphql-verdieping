package graph

import (
	"github.com/lnieuwenhuis/graphql-verdieping/custom/database"
	"gorm.io/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB *gorm.DB
}

// NewResolver creates a new resolver with database connection
func NewResolver() (*Resolver, error) {
	database.InitDatabase()
	return &Resolver{
		DB: database.DB,
	}, nil
}
