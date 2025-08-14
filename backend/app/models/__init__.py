from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from enum import Enum


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class Currency(str, Enum):
    USD = "USD"
    EUR = "EUR"
    INR = "INR"
    GBP = "GBP"
    CAD = "CAD"
    AUD = "AUD"


class TransactionType(str, Enum):
    SPLIT = "split"
    PAYMENT = "payment"
    LOAN = "loan"
    REFUND = "refund"


class TransactionStatus(str, Enum):
    PENDING = "pending"
    SETTLED = "settled"
    CANCELLED = "cancelled"


# Balance Models
class Balance(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    name: str
    avatar: str
    amount: float
    currency: Currency = Currency.INR
    last_activity: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Transaction Models
class Transaction(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    title: str
    amount: float
    currency: Currency = Currency.INR
    type: TransactionType
    status: TransactionStatus = TransactionStatus.PENDING
    group_id: Optional[str] = None
    participants: List[str] = []
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Group Models
class GroupMember(BaseModel):
    user_id: str
    name: str
    avatar: str
    balance: float = 0.0
    currency: Currency = Currency.INR


class Group(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: Optional[str] = None
    avatar: str
    members: List[GroupMember] = []
    total_expenses: float = 0.0
    currency: Currency = Currency.INR
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Activity Models
class ActivityItem(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    type: TransactionType
    title: str
    description: str
    amount: float
    currency: Currency = Currency.INR
    group_id: Optional[str] = None
    group_name: Optional[str] = None
    participants: List[str] = []
    created_by: str
    status: TransactionStatus = TransactionStatus.PENDING
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# User Models
class UserPreferences(BaseModel):
    currency: Currency = Currency.INR
    language: str = "en"
    notifications: bool = True
    theme: str = "light"


class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: str = Field(..., unique=True)
    username: str = Field(..., unique=True)
    full_name: str
    avatar: str = ""
    phone: Optional[str] = None
    preferences: UserPreferences = UserPreferences()
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Support Models
class FAQItem(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    question: str
    answer: str
    category: str
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Spending Report Models
class SpendingCategory(BaseModel):
    name: str
    amount: float
    percentage: float
    color: str


class SpendingReport(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    month: int
    year: int
    total_spent: float
    currency: Currency = Currency.INR
    categories: List[SpendingCategory] = []
    trends: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Request/Response Models
class BalanceCreate(BaseModel):
    user_id: str
    name: str
    avatar: str
    amount: float
    currency: Currency = Currency.INR


class BalanceUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[Currency] = None


class TransactionCreate(BaseModel):
    user_id: str
    title: str
    amount: float
    currency: Currency = Currency.INR
    type: TransactionType
    group_id: Optional[str] = None
    participants: List[str] = []
    description: Optional[str] = None


class TransactionUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[Currency] = None
    type: Optional[TransactionType] = None
    status: Optional[TransactionStatus] = None
    participants: Optional[List[str]] = None
    description: Optional[str] = None


class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    avatar: str
    created_by: str
    currency: Currency = Currency.INR


class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    avatar: Optional[str] = None


class UserCreate(BaseModel):
    email: str
    username: str
    full_name: str
    phone: Optional[str] = None
    avatar: str = ""


class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    preferences: Optional[UserPreferences] = None
