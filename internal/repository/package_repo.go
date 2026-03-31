package repository

import (
	"changestreams/internal/model"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const collectionPackages = "packages"

type PackageRepository interface {
	Create(ctx context.Context, pkg *model.Package) error
	FindByID(ctx context.Context, id primitive.ObjectID) (*model.Package, error)
	FindAllActive(ctx context.Context) ([]model.Package, error)
}

type packageRepository struct {
	db *mongo.Database
}

func NewPackageRepository(db *mongo.Database) PackageRepository {
	return &packageRepository{db: db}
}

func (r *packageRepository) Create(ctx context.Context, pkg *model.Package) error {
	pkg.ID = primitive.NewObjectID()
	pkg.IsActive = true
	pkg.CreatedAt = time.Now()
	pkg.UpdatedAt = time.Now()
	_, err := r.db.Collection(collectionPackages).InsertOne(ctx, pkg)
	return err
}

func (r *packageRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Package, error) {
	var pkg model.Package
	if err := r.db.Collection(collectionPackages).FindOne(ctx, bson.M{"_id": id, "is_active": true}).Decode(&pkg); err != nil {
		return nil, err
	}
	return &pkg, nil
}

func (r *packageRepository) FindAllActive(ctx context.Context) ([]model.Package, error) {
	cursor, err := r.db.Collection(collectionPackages).Find(ctx, bson.M{"is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var packages []model.Package
	if err := cursor.All(ctx, &packages); err != nil {
		return nil, err
	}
	return packages, nil
}
