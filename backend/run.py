#!/usr/bin/env python3
"""
PaisaSplit Backend Server
FastAPI server for PaisaSplit expense tracking application
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app", host="0.0.0.0", port=8000, reload=True, log_level="info"
    )
