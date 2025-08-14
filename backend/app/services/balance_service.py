from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.models import Balance, BalanceCreate, BalanceUpdate, Currency


class BalanceService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.database = database
        self.collection = database.balances

    # Currency conversion rates (simplified - in production, use real-time rates)
    CURRENCY_RATES = {
        Currency.USD: 83.0,  # 1 USD = 83 INR
        Currency.EUR: 89.0,  # 1 EUR = 89 INR
        Currency.GBP: 104.0,  # 1 GBP = 104 INR
        Currency.CAD: 61.0,  # 1 CAD = 61 INR
        Currency.AUD: 54.0,  # 1 AUD = 54 INR
        Currency.INR: 1.0,  # 1 INR = 1 INR
    }

    def convert_to_inr(self, amount: float, currency: Currency) -> float:
        """Convert amount from given currency to INR"""
        return amount * self.CURRENCY_RATES.get(currency, 1.0)

    async def create_balance(self, balance_data: BalanceCreate) -> Balance:
        """Create a new balance record"""
        balance_dict = balance_data.dict()
        balance_dict["last_activity"] = datetime.utcnow()
        balance_dict["created_at"] = datetime.utcnow()
        balance_dict["updated_at"] = datetime.utcnow()

        result = await self.collection.insert_one(balance_dict)
        balance_dict["_id"] = result.inserted_id

        return Balance(**balance_dict)

    async def get_balances(
        self, skip: int = 0, limit: int = 100, user_id: Optional[str] = None
    ) -> List[Balance]:
        """Get all balances with optional filtering"""
        filter_dict = {}
        if user_id:
            filter_dict["user_id"] = user_id

        cursor = (
            self.collection.find(filter_dict)
            .skip(skip)
            .limit(limit)
            .sort("last_activity", -1)
        )
        balances = []
        async for balance_doc in cursor:
            balances.append(Balance(**balance_doc))
        return balances

    async def get_balance_by_id(self, balance_id: str) -> Optional[Balance]:
        """Get a balance by ID"""
        try:
            balance_doc = await self.collection.find_one({"_id": ObjectId(balance_id)})
            if balance_doc:
                return Balance(**balance_doc)
        except Exception:
            pass
        return None

    async def get_balances_by_user(self, user_id: str) -> List[Balance]:
        """Get all balances for a specific user"""
        cursor = self.collection.find({"user_id": user_id}).sort("last_activity", -1)
        balances = []
        async for balance_doc in cursor:
            balances.append(Balance(**balance_doc))
        return balances

    async def update_balance(
        self, balance_id: str, balance_data: BalanceUpdate
    ) -> Optional[Balance]:
        """Update a balance"""
        try:
            update_dict = {
                k: v for k, v in balance_data.dict().items() if v is not None
            }
            if not update_dict:
                return await self.get_balance_by_id(balance_id)

            update_dict["updated_at"] = datetime.utcnow()
            update_dict["last_activity"] = datetime.utcnow()

            result = await self.collection.update_one(
                {"_id": ObjectId(balance_id)}, {"$set": update_dict}
            )

            if result.modified_count:
                return await self.get_balance_by_id(balance_id)
        except Exception:
            pass
        return None

    async def delete_balance(self, balance_id: str) -> bool:
        """Delete a balance"""
        try:
            result = await self.collection.delete_one({"_id": ObjectId(balance_id)})
            return result.deleted_count > 0
        except Exception:
            return False

    async def get_user_total_balance(self, user_id: str) -> float:
        """Get total balance for a user across all currencies (converted to INR)"""
        balances = await self.get_balances_by_user(user_id)
        total_inr = 0.0

        for balance in balances:
            total_inr += self.convert_to_inr(balance.amount, balance.currency)

        return total_inr

    async def update_balance_amount(
        self, user_id: str, amount_change: float, currency: Currency = Currency.INR
    ) -> bool:
        """Update balance amount for a user (add or subtract)"""
        try:
            # Find or create balance record for this user and currency
            balance_doc = await self.collection.find_one(
                {"user_id": user_id, "currency": currency}
            )

            if balance_doc:
                # Update existing balance
                new_amount = balance_doc["amount"] + amount_change
                result = await self.collection.update_one(
                    {"_id": balance_doc["_id"]},
                    {
                        "$set": {
                            "amount": new_amount,
                            "last_activity": datetime.utcnow(),
                            "updated_at": datetime.utcnow(),
                        }
                    },
                )
                return result.modified_count > 0
            else:
                # Create new balance record if amount_change is positive
                if amount_change > 0:
                    balance_data = BalanceCreate(
                        user_id=user_id,
                        name="Auto-generated",
                        avatar="",
                        amount=amount_change,
                        currency=currency,
                    )
                    await self.create_balance(balance_data)
                    return True

        except Exception:
            pass
        return False
