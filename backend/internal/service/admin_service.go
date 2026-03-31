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

type CreatePackageInput struct {
	Name        string  `json:"name"        binding:"required"`
	Description string  `json:"description" binding:"required"`
	Price       float64 `json:"price"       binding:"required,gt=0"`
}

type AdminService interface {
	CreatePackage(ctx context.Context, adminID primitive.ObjectID, input CreatePackageInput) (*model.Package, error)
	ApproveOrder(ctx context.Context, orderID primitive.ObjectID) error
	RejectOrder(ctx context.Context, orderID primitive.ObjectID) error
	ApproveRefund(ctx context.Context, orderID primitive.ObjectID) error
	ListOrders(ctx context.Context, status model.OrderStatus) ([]model.Order, error)
}

type adminService struct {
	packageRepo repository.PackageRepository
	orderRepo   repository.OrderRepository
	userRepo    repository.UserRepository
	txRepo      repository.TransactionRepository
	mongoClient *mongo.Client
}

func NewAdminService(
	packageRepo repository.PackageRepository,
	orderRepo repository.OrderRepository,
	userRepo repository.UserRepository,
	txRepo repository.TransactionRepository,
	mongoClient *mongo.Client,
) AdminService {
	return &adminService{
		packageRepo: packageRepo,
		orderRepo:   orderRepo,
		userRepo:    userRepo,
		txRepo:      txRepo,
		mongoClient: mongoClient,
	}
}

func (s *adminService) CreatePackage(ctx context.Context, adminID primitive.ObjectID, input CreatePackageInput) (*model.Package, error) {
	pkg := &model.Package{
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		CreatedBy:   adminID,
	}
	if err := s.packageRepo.Create(ctx, pkg); err != nil {
		return nil, fmt.Errorf("create package: %w", err)
	}
	return pkg, nil
}

func (s *adminService) ApproveOrder(ctx context.Context, orderID primitive.ObjectID) error {
	order, err := s.orderRepo.FindByID(ctx, orderID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return ErrOrderNotFound
		}
		return fmt.Errorf("find order: %w", err)
	}
	if order.Status != model.OrderStatusPending {
		return ErrInvalidOrderState
	}
	if err := s.orderRepo.UpdateStatus(ctx, orderID, model.OrderStatusApproved); err != nil {
		return fmt.Errorf("approve order: %w", err)
	}
	return nil
}

// RejectOrder refunds credit back to the user atomically when rejecting a pending order.
func (s *adminService) RejectOrder(ctx context.Context, orderID primitive.ObjectID) error {
	order, err := s.orderRepo.FindByID(ctx, orderID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return ErrOrderNotFound
		}
		return fmt.Errorf("find order: %w", err)
	}
	if order.Status != model.OrderStatusPending {
		return ErrInvalidOrderState
	}

	session, err := s.mongoClient.StartSession()
	if err != nil {
		return fmt.Errorf("start session: %w", err)
	}
	defer session.EndSession(ctx)

	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
		if err := s.orderRepo.UpdateStatus(sessCtx, orderID, model.OrderStatusRejected); err != nil {
			return nil, fmt.Errorf("update order status: %w", err)
		}
		if err := s.userRepo.IncrementCredit(sessCtx, order.UserID, order.Amount); err != nil {
			return nil, fmt.Errorf("return credit on rejection: %w", err)
		}
		tx := &model.Transaction{
			UserID:      order.UserID,
			Type:        model.TransactionTypeRefund,
			Amount:      order.Amount,
			ReferenceID: &order.ID,
		}
		if err := s.txRepo.Create(sessCtx, tx); err != nil {
			return nil, fmt.Errorf("record refund transaction: %w", err)
		}
		return nil, nil
	})
	return err
}

// ApproveRefund returns credit to the user atomically when approving a refund request.
func (s *adminService) ApproveRefund(ctx context.Context, orderID primitive.ObjectID) error {
	order, err := s.orderRepo.FindByID(ctx, orderID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return ErrOrderNotFound
		}
		return fmt.Errorf("find order: %w", err)
	}
	if order.Status != model.OrderStatusRefundRequested {
		return ErrInvalidOrderState
	}

	session, err := s.mongoClient.StartSession()
	if err != nil {
		return fmt.Errorf("start session: %w", err)
	}
	defer session.EndSession(ctx)

	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
		if err := s.orderRepo.UpdateStatus(sessCtx, orderID, model.OrderStatusRefunded); err != nil {
			return nil, fmt.Errorf("update order status: %w", err)
		}
		if err := s.userRepo.IncrementCredit(sessCtx, order.UserID, order.Amount); err != nil {
			return nil, fmt.Errorf("return credit on refund: %w", err)
		}
		tx := &model.Transaction{
			UserID:      order.UserID,
			Type:        model.TransactionTypeRefund,
			Amount:      order.Amount,
			ReferenceID: &order.ID,
		}
		if err := s.txRepo.Create(sessCtx, tx); err != nil {
			return nil, fmt.Errorf("record refund transaction: %w", err)
		}
		return nil, nil
	})
	return err
}

func (s *adminService) ListOrders(ctx context.Context, status model.OrderStatus) ([]model.Order, error) {
	orders, err := s.orderRepo.FindByStatus(ctx, status)
	if err != nil {
		return nil, fmt.Errorf("list orders by status: %w", err)
	}
	return orders, nil
}
