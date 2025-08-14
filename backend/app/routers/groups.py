from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional

from app.models import Group, GroupCreate, GroupUpdate, GroupMember
from app.core.database import get_database
from app.services.group_service import GroupService

router = APIRouter()


def get_group_service():
    db = get_database()
    return GroupService(db)


@router.post("/", response_model=Group, status_code=status.HTTP_201_CREATED)
async def create_group(
    group_data: GroupCreate, group_service: GroupService = Depends(get_group_service)
):
    """Create a new group"""
    group = await group_service.create_group(group_data)
    return group


@router.get("/", response_model=List[Group])
async def get_groups(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None,
    group_service: GroupService = Depends(get_group_service),
):
    """Get all groups with optional filtering by user_id (groups where user is a member)"""
    groups = await group_service.get_groups(skip=skip, limit=limit, user_id=user_id)
    return groups


@router.get("/{group_id}", response_model=Group)
async def get_group(
    group_id: str, group_service: GroupService = Depends(get_group_service)
):
    """Get a specific group by ID"""
    group = await group_service.get_group_by_id(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group


@router.get("/user/{user_id}", response_model=List[Group])
async def get_user_groups(
    user_id: str, group_service: GroupService = Depends(get_group_service)
):
    """Get all groups where a user is a member"""
    groups = await group_service.get_groups_by_user(user_id)
    return groups


@router.put("/{group_id}", response_model=Group)
async def update_group(
    group_id: str,
    group_data: GroupUpdate,
    group_service: GroupService = Depends(get_group_service),
):
    """Update a group"""
    group = await group_service.update_group(group_id, group_data)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group


@router.delete("/{group_id}")
async def delete_group(
    group_id: str, group_service: GroupService = Depends(get_group_service)
):
    """Delete a group"""
    success = await group_service.delete_group(group_id)
    if not success:
        raise HTTPException(status_code=404, detail="Group not found")
    return {"message": "Group deleted successfully"}


@router.post("/{group_id}/members", response_model=Group)
async def add_group_member(
    group_id: str,
    member: GroupMember,
    group_service: GroupService = Depends(get_group_service),
):
    """Add a member to a group"""
    group = await group_service.add_member(group_id, member)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group


@router.delete("/{group_id}/members/{user_id}")
async def remove_group_member(
    group_id: str,
    user_id: str,
    group_service: GroupService = Depends(get_group_service),
):
    """Remove a member from a group"""
    success = await group_service.remove_member(group_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Group or member not found")
    return {"message": "Member removed successfully"}


@router.get("/{group_id}/balance")
async def get_group_balance_summary(
    group_id: str, group_service: GroupService = Depends(get_group_service)
):
    """Get balance summary for a group"""
    summary = await group_service.get_group_balance_summary(group_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Group not found")
    return summary
