from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional

from app.models import (
    Transaction,
    TransactionCreate,
    TransactionUpdate,
    TransactionType,
    TransactionStatus,
)
from app.core.database import get_database
from app.services.transaction_service import TransactionService

router = APIRouter()


def get_transaction_service():
    db = get_database()
    return TransactionService(db)


@router.post("/", response_model=Transaction, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: TransactionCreate,
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    """Create a new transaction"""
    transaction = await transaction_service.create_transaction(transaction_data)
    return transaction


@router.get("/", response_model=List[Transaction])
async def get_transactions(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None,
    group_id: Optional[str] = None,
    transaction_type: Optional[TransactionType] = None,
    status: Optional[TransactionStatus] = None,
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    """Get all transactions with optional filtering"""
    transactions = await transaction_service.get_transactions(
        skip=skip,
        limit=limit,
        user_id=user_id,
        group_id=group_id,
        transaction_type=transaction_type,
        status=status,
    )
    return transactions


@router.get("/{transaction_id}", response_model=Transaction)
async def get_transaction(
    transaction_id: str,
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    """Get a specific transaction by ID"""
    transaction = await transaction_service.get_transaction_by_id(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.get("/user/{user_id}", response_model=List[Transaction])
async def get_user_transactions(
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    """Get all transactions for a specific user"""
    transactions = await transaction_service.get_transactions_by_user(
        user_id, skip=skip, limit=limit
    )
    return transactions


@router.get("/group/{group_id}", response_model=List[Transaction])
async def get_group_transactions(
    group_id: str,
    skip: int = 0,
    limit: int = 100,
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    """Get all transactions for a specific group"""
    transactions = await transaction_service.get_transactions_by_group(
        group_id, skip=skip, limit=limit
    )
    return transactions


@router.put("/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: str,
    transaction_data: TransactionUpdate,
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    """Update a transaction"""
    transaction = await transaction_service.update_transaction(
        transaction_id, transaction_data
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    """Delete a transaction"""
    success = await transaction_service.delete_transaction(transaction_id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}


@router.patch("/{transaction_id}/status")
async def update_transaction_status(
    transaction_id: str,
    status: TransactionStatus,
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    """Update transaction status"""
    transaction = await transaction_service.update_transaction_status(
        transaction_id, status
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.get("/user/{user_id}/summary")
async def get_user_transaction_summary(
    user_id: str,
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    """Get transaction summary for a user"""
    summary = await transaction_service.get_user_transaction_summary(user_id)
    return summary
