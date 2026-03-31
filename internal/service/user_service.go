package service

import (
	"changestreams/internal/model"
	"changestreams/internal/repository"
	"context"
	"errors"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ErrInsufficientCredit = errors.New("insufficient credit balance")
	ErrPackageNotFound    = errors.New("package not found")
	ErrOrderNotFound      = errors.New("order not found")
	ErrInvalidOrderState  = errors.New("order is in an invalid state for this action")
)

type TopupInput struct {
	Amount float64 `json:"amount" binding:"required,gt=0"`
}

type UserService interface {
	TopupCredit(ctx context.Context, userID primitive.ObjectID, amount float64) error
	BuyPackage(ctx context.Context, userID, packageID primitive.ObjectID) (*model.Order, error)
	RequestRefund(ctx context.Context, userID, orderID primitive.ObjectID) error
	GetOrders(ctx context.Context, userID primitive.ObjectID) ([]model.Order, error)
	GetPackages(ctx context.Context) ([]model.Package, error)
}

type userService struct {
	userRepo    repository.UserRepository
	packageRepo repository.PackageRepository
	orderRepo   repository.OrderRepository
	txRepo      repository.TransactionRepository
	mongoClient *mongo.Client
}

func NewUserService(
	userRepo repository.UserRepository,
	packageRepo repository.PackageRepository,
	orderRepo repository.OrderRepository,
	txRepo repository.TransactionRepository,
	mongoClient *mongo.Client,
) UserService {
	return &userService{
		userRepo:    userRepo,
		packageRepo: packageRepo,
		orderRepo:   orderRepo,
		txRepo:      txRepo,
		mongoClient: mongoClient,
	}
}

func (s *userService) TopupCredit(ctx context.Context, userID primitive.ObjectID, amount float64) error {
	if err := s.userRepo.IncrementCredit(ctx, userID, amount); err != nil {
		return fmt.Errorf("topup credit: %w", err)
	}
	tx := &model.Transaction{
		UserID: userID,
		Type:   model.TransactionTypeTopup,
		Amount: amount,
	}
	if err := s.txRepo.Create(ctx, tx); err != nil {
		return fmt.Errorf("record topup transaction: %w", err)
	}
	return nil
}

// BuyPackage deducts credit, creates a pending order and a purchase transaction atomically.
func (s *userService) BuyPackage(ctx context.Context, userID, packageID primitive.ObjectID) (*model.Order, error) {
	pkg, err := s.packageRepo.FindByID(ctx, packageID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrPackageNotFound
		}
		return nil, fmt.Errorf("find package: %w", err)
	}

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("find user: %w", err)
	}
	if user.CreditBalance < pkg.Price {
		return nil, ErrInsufficientCredit
	}

	session, err := s.mongoClient.StartSession()
	if err != nil {
		return nil, fmt.Errorf("start session: %w", err)
	}
	defer session.EndSession(ctx)

	var order *model.Order
	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
		if err := s.userRepo.IncrementCredit(sessCtx, userID, -pkg.Price); err != nil {
			return nil, fmt.Errorf("deduct credit: %w", err)
		}

		order = &model.Order{
			UserID:    userID,
			PackageID: packageID,
			Amount:    pkg.Price,
			Status:    model.OrderStatusPending,
		}
		if err := s.orderRepo.Create(sessCtx, order); err != nil {
			return nil, fmt.Errorf("create order: %w", err)
		}

		tx := &model.Transaction{
			UserID:      userID,
			Type:        model.TransactionTypePurchase,
			Amount:      pkg.Price,
			ReferenceID: &order.ID,
		}
		if err := s.txRepo.Create(sessCtx, tx); err != nil {
			return nil, fmt.Errorf("record purchase transaction: %w", err)
		}
		return nil, nil
	})
	if err != nil {
		return nil, err
	}
	return order, nil
}

func (s *userService) RequestRefund(ctx context.Context, userID, orderID primitive.ObjectID) error {
	order, err := s.orderRepo.FindByID(ctx, orderID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return ErrOrderNotFound
		}
		return fmt.Errorf("find order: %w", err)
	}
	if order.UserID != userID {
		return ErrOrderNotFound
	}
	if order.Status != model.OrderStatusApproved {
		return ErrInvalidOrderState
	}
	if err := s.orderRepo.UpdateStatus(ctx, orderID, model.OrderStatusRefundRequested); err != nil {
		return fmt.Errorf("update order status: %w", err)
	}
	return nil
}

func (s *userService) GetOrders(ctx context.Context, userID primitive.ObjectID) ([]model.Order, error) {
	orders, err := s.orderRepo.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get orders: %w", err)
	}
	return orders, nil
}

func (s *userService) GetPackages(ctx context.Context) ([]model.Package, error) {
	packages, err := s.packageRepo.FindAllActive(ctx)
	if err != nil {
		return nil, fmt.Errorf("get packages: %w", err)
	}
	return packages, nil
}
