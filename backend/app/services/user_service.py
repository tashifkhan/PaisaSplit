from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.models import User, UserCreate, UserUpdate, UserPreferences


class UserService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.database = database
        self.collection = database.users

    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        # Check if email already exists
        existing_email = await self.collection.find_one({"email": user_data.email})
        if existing_email:
            raise ValueError("Email already registered")

        # Check if username already exists
        existing_username = await self.collection.find_one(
            {"username": user_data.username}
        )
        if existing_username:
            raise ValueError("Username already taken")

        # Create user document
        user_dict = user_data.dict()
        user_dict["preferences"] = UserPreferences().dict()
        user_dict["is_active"] = True
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()

        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id

        return User(**user_dict)

    async def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination"""
        cursor = self.collection.find({"is_active": True}).skip(skip).limit(limit)
        users = []
        async for user_doc in cursor:
            users.append(User(**user_doc))
        return users

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get a user by ID"""
        try:
            user_doc = await self.collection.find_one(
                {"_id": ObjectId(user_id), "is_active": True}
            )
            if user_doc:
                return User(**user_doc)
        except Exception:
            pass
        return None

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        user_doc = await self.collection.find_one({"email": email, "is_active": True})
        if user_doc:
            return User(**user_doc)
        return None

    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get a user by username"""
        user_doc = await self.collection.find_one(
            {"username": username, "is_active": True}
        )
        if user_doc:
            return User(**user_doc)
        return None

    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update a user"""
        try:
            # Prepare update data
            update_dict = {k: v for k, v in user_data.dict().items() if v is not None}
            if not update_dict:
                # If no fields to update, just return the current user
                return await self.get_user_by_id(user_id)

            update_dict["updated_at"] = datetime.utcnow()

            # Check for username conflicts if username is being updated
            if "username" in update_dict:
                existing = await self.collection.find_one(
                    {
                        "username": update_dict["username"],
                        "_id": {"$ne": ObjectId(user_id)},
                    }
                )
                if existing:
                    raise ValueError("Username already taken")

            result = await self.collection.update_one(
                {"_id": ObjectId(user_id), "is_active": True}, {"$set": update_dict}
            )

            if result.modified_count:
                return await self.get_user_by_id(user_id)
        except Exception:
            pass
        return None

    async def delete_user(self, user_id: str) -> bool:
        """Soft delete a user (mark as inactive)"""
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"is_active": False, "updated_at": datetime.utcnow()}},
            )
            return result.modified_count > 0
        except Exception:
            return False

    async def search_users(self, query: str, limit: int = 10) -> List[User]:
        """Search users by name or username"""
        search_filter = {
            "$and": [
                {"is_active": True},
                {
                    "$or": [
                        {"full_name": {"$regex": query, "$options": "i"}},
                        {"username": {"$regex": query, "$options": "i"}},
                    ]
                },
            ]
        }

        cursor = self.collection.find(search_filter).limit(limit)
        users = []
        async for user_doc in cursor:
            users.append(User(**user_doc))
        return users
