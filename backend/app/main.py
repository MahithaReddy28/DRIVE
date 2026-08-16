import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import asyncio
import json

from app.config import settings
from app.api.router import router as api_router
from app.graph.engine import graph_engine

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include REST API endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

# Active WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/disaster")
async def websocket_disaster_feed(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial status
        stats = graph_engine.get_stats()
        await websocket.send_json({
            "event": "CONNECTED",
            "message": "Connected to DRIVE Live Telemetry Stream",
            "stats": stats
        })
        while True:
            # Keep alive & listen for client messages
            data = await websocket.receive_text()
            payload = json.loads(data) if data else {}
            if payload.get("action") == "PING":
                await websocket.send_json({"event": "PONG", "timestamp": str(asyncio.get_event_loop().time())})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "message": "Welcome to DRIVE Topological Disaster Supply Rerouting Engine",
        "documentation": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
