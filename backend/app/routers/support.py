from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional

from app.models import FAQItem, SpendingReport
from app.core.database import get_database
from app.services.support_service import SupportService

router = APIRouter()


def get_support_service():
    db = get_database()
    return SupportService(db)


@router.get("/faq", response_model=List[FAQItem])
async def get_faq_items(
    category: Optional[str] = None,
    support_service: SupportService = Depends(get_support_service),
):
    """Get all FAQ items, optionally filtered by category"""
    faq_items = await support_service.get_faq_items(category=category)
    return faq_items


@router.get("/faq/{faq_id}", response_model=FAQItem)
async def get_faq_item(
    faq_id: str, support_service: SupportService = Depends(get_support_service)
):
    """Get a specific FAQ item by ID"""
    faq_item = await support_service.get_faq_item_by_id(faq_id)
    if not faq_item:
        raise HTTPException(status_code=404, detail="FAQ item not found")
    return faq_item


@router.post("/faq", response_model=FAQItem, status_code=status.HTTP_201_CREATED)
async def create_faq_item(
    question: str,
    answer: str,
    category: str,
    order: int = 0,
    support_service: SupportService = Depends(get_support_service),
):
    """Create a new FAQ item"""
    faq_item = await support_service.create_faq_item(question, answer, category, order)
    return faq_item


@router.put("/faq/{faq_id}", response_model=FAQItem)
async def update_faq_item(
    faq_id: str,
    question: Optional[str] = None,
    answer: Optional[str] = None,
    category: Optional[str] = None,
    order: Optional[int] = None,
    is_active: Optional[bool] = None,
    support_service: SupportService = Depends(get_support_service),
):
    """Update an FAQ item"""
    faq_item = await support_service.update_faq_item(
        faq_id, question, answer, category, order, is_active
    )
    if not faq_item:
        raise HTTPException(status_code=404, detail="FAQ item not found")
    return faq_item


@router.delete("/faq/{faq_id}")
async def delete_faq_item(
    faq_id: str, support_service: SupportService = Depends(get_support_service)
):
    """Delete an FAQ item"""
    success = await support_service.delete_faq_item(faq_id)
    if not success:
        raise HTTPException(status_code=404, detail="FAQ item not found")
    return {"message": "FAQ item deleted successfully"}


@router.get("/spending-reports/{user_id}", response_model=List[SpendingReport])
async def get_user_spending_reports(
    user_id: str,
    year: Optional[int] = None,
    limit: int = 12,
    support_service: SupportService = Depends(get_support_service),
):
    """Get spending reports for a user"""
    reports = await support_service.get_spending_reports(
        user_id, year=year, limit=limit
    )
    return reports


@router.get("/spending-reports/{user_id}/{year}/{month}", response_model=SpendingReport)
async def get_spending_report(
    user_id: str,
    year: int,
    month: int,
    support_service: SupportService = Depends(get_support_service),
):
    """Get a specific spending report for a user, year, and month"""
    report = await support_service.get_spending_report(user_id, year, month)
    if not report:
        raise HTTPException(status_code=404, detail="Spending report not found")
    return report


@router.post(
    "/spending-reports",
    response_model=SpendingReport,
    status_code=status.HTTP_201_CREATED,
)
async def generate_spending_report(
    user_id: str,
    year: int,
    month: int,
    support_service: SupportService = Depends(get_support_service),
):
    """Generate a new spending report for a user, year, and month"""
    report = await support_service.generate_spending_report(user_id, year, month)
    return report


@router.get("/categories")
async def get_faq_categories(
    support_service: SupportService = Depends(get_support_service),
):
    """Get all available FAQ categories"""
    categories = await support_service.get_faq_categories()
    return {"categories": categories}
