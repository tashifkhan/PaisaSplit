from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, timedelta

from app.models import ActivityItem, TransactionType, TransactionStatus
from app.core.database import get_database
from app.services.activity_service import ActivityService

router = APIRouter()


def get_activity_service():
    db = get_database()
    return ActivityService(db)


@router.get("/", response_model=List[ActivityItem])
async def get_activities(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None,
    group_id: Optional[str] = None,
    activity_type: Optional[TransactionType] = None,
    days: Optional[int] = None,
    activity_service: ActivityService = Depends(get_activity_service),
):
    """Get all activities with optional filtering"""
    # Calculate date filter if days parameter is provided
    since_date = None
    if days:
        since_date = datetime.utcnow() - timedelta(days=days)

    activities = await activity_service.get_activities(
        skip=skip,
        limit=limit,
        user_id=user_id,
        group_id=group_id,
        activity_type=activity_type,
        since_date=since_date,
    )
    return activities


@router.get("/{activity_id}", response_model=ActivityItem)
async def get_activity(
    activity_id: str, activity_service: ActivityService = Depends(get_activity_service)
):
    """Get a specific activity by ID"""
    activity = await activity_service.get_activity_by_id(activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity


@router.get("/user/{user_id}", response_model=List[ActivityItem])
async def get_user_activities(
    user_id: str,
    skip: int = 0,
    limit: int = 50,
    days: Optional[int] = 30,
    activity_service: ActivityService = Depends(get_activity_service),
):
    """Get all activities for a specific user"""
    since_date = None
    if days:
        since_date = datetime.utcnow() - timedelta(days=days)

    activities = await activity_service.get_activities_by_user(
        user_id, skip=skip, limit=limit, since_date=since_date
    )
    return activities


@router.get("/group/{group_id}", response_model=List[ActivityItem])
async def get_group_activities(
    group_id: str,
    skip: int = 0,
    limit: int = 50,
    days: Optional[int] = 30,
    activity_service: ActivityService = Depends(get_activity_service),
):
    """Get all activities for a specific group"""
    since_date = None
    if days:
        since_date = datetime.utcnow() - timedelta(days=days)

    activities = await activity_service.get_activities_by_group(
        group_id, skip=skip, limit=limit, since_date=since_date
    )
    return activities


@router.get("/user/{user_id}/recent")
async def get_recent_user_activities(
    user_id: str,
    limit: int = 10,
    activity_service: ActivityService = Depends(get_activity_service),
):
    """Get recent activities for a user (last 7 days)"""
    since_date = datetime.utcnow() - timedelta(days=7)
    activities = await activity_service.get_activities_by_user(
        user_id, skip=0, limit=limit, since_date=since_date
    )
    return activities


@router.get("/feed/{user_id}")
async def get_activity_feed(
    user_id: str,
    skip: int = 0,
    limit: int = 20,
    activity_service: ActivityService = Depends(get_activity_service),
):
    """Get activity feed for a user (includes user's activities and group activities)"""
    feed = await activity_service.get_activity_feed(user_id, skip=skip, limit=limit)
    return feed


@router.get("/stats/{user_id}")
async def get_activity_stats(
    user_id: str,
    days: int = 30,
    activity_service: ActivityService = Depends(get_activity_service),
):
    """Get activity statistics for a user"""
    since_date = datetime.utcnow() - timedelta(days=days)
    stats = await activity_service.get_activity_stats(user_id, since_date)
    return stats
