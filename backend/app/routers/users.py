from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime

from app.models import User, UserCreate, UserUpdate
from app.core.database import get_database
from app.services.user_service import UserService

router = APIRouter()


def get_user_service():
    db = get_database()
    return UserService(db)


@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate, user_service: UserService = Depends(get_user_service)
):
    """Create a new user"""
    try:
        user = await user_service.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[User])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    user_service: UserService = Depends(get_user_service),
):
    """Get all users with pagination"""
    users = await user_service.get_users(skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str, user_service: UserService = Depends(get_user_service)):
    """Get a specific user by ID"""
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/email/{email}", response_model=User)
async def get_user_by_email(
    email: str, user_service: UserService = Depends(get_user_service)
):
    """Get a user by email"""
    user = await user_service.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/username/{username}", response_model=User)
async def get_user_by_username(
    username: str, user_service: UserService = Depends(get_user_service)
):
    """Get a user by username"""
    user = await user_service.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    user_service: UserService = Depends(get_user_service),
):
    """Update a user"""
    user = await user_service.update_user(user_id, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: str, user_service: UserService = Depends(get_user_service)
):
    """Delete a user"""
    success = await user_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
