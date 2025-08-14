from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routers import balances, groups, activities, users, transactions, support

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up PaisaSplit API...")
    await connect_to_mongo()
    yield
    # Shutdown
    logger.info("Shutting down PaisaSplit API...")
    await close_mongo_connection()


# Create FastAPI app
app = FastAPI(
    title="PaisaSplit API",
    description="Backend API for PaisaSplit expense tracking application",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_hosts,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(balances.router, prefix="/api/v1/balances", tags=["balances"])
app.include_router(groups.router, prefix="/api/v1/groups", tags=["groups"])
app.include_router(
    transactions.router, prefix="/api/v1/transactions", tags=["transactions"]
)
app.include_router(activities.router, prefix="/api/v1/activities", tags=["activities"])
app.include_router(support.router, prefix="/api/v1/support", tags=["support"])


@app.get("/")
async def root():
    return {"message": "Welcome to PaisaSplit API", "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "PaisaSplit API is running"}
