from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional

from app.models import Balance, BalanceCreate, BalanceUpdate
from app.core.database import get_database
from app.services.balance_service import BalanceService

router = APIRouter()


def get_balance_service():
    db = get_database()
    return BalanceService(db)


@router.post("/", response_model=Balance, status_code=status.HTTP_201_CREATED)
async def create_balance(
    balance_data: BalanceCreate,
    balance_service: BalanceService = Depends(get_balance_service),
):
    """Create a new balance record"""
    balance = await balance_service.create_balance(balance_data)
    return balance


@router.get("/", response_model=List[Balance])
async def get_balances(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None,
    balance_service: BalanceService = Depends(get_balance_service),
):
    """Get all balances with optional filtering by user_id"""
    balances = await balance_service.get_balances(
        skip=skip, limit=limit, user_id=user_id
    )
    return balances


@router.get("/{balance_id}", response_model=Balance)
async def get_balance(
    balance_id: str, balance_service: BalanceService = Depends(get_balance_service)
):
    """Get a specific balance by ID"""
    balance = await balance_service.get_balance_by_id(balance_id)
    if not balance:
        raise HTTPException(status_code=404, detail="Balance not found")
    return balance


@router.get("/user/{user_id}", response_model=List[Balance])
async def get_user_balances(
    user_id: str, balance_service: BalanceService = Depends(get_balance_service)
):
    """Get all balances for a specific user"""
    balances = await balance_service.get_balances_by_user(user_id)
    return balances


@router.put("/{balance_id}", response_model=Balance)
async def update_balance(
    balance_id: str,
    balance_data: BalanceUpdate,
    balance_service: BalanceService = Depends(get_balance_service),
):
    """Update a balance"""
    balance = await balance_service.update_balance(balance_id, balance_data)
    if not balance:
        raise HTTPException(status_code=404, detail="Balance not found")
    return balance


@router.delete("/{balance_id}")
async def delete_balance(
    balance_id: str, balance_service: BalanceService = Depends(get_balance_service)
):
    """Delete a balance"""
    success = await balance_service.delete_balance(balance_id)
    if not success:
        raise HTTPException(status_code=404, detail="Balance not found")
    return {"message": "Balance deleted successfully"}


@router.get("/user/{user_id}/total")
async def get_user_total_balance(
    user_id: str, balance_service: BalanceService = Depends(get_balance_service)
):
    """Get total balance for a user across all currencies (converted to INR)"""
    total = await balance_service.get_user_total_balance(user_id)
    return {"user_id": user_id, "total_balance": total, "currency": "INR"}
