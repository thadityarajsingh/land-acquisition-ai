from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.prediction import router as prediction_router
from backend.routes.what_if import router as what_if_router
from backend.routes.projects import router as projects_router
from backend.routes.recommendations import router as recommendations_router

app = FastAPI(
    title="Land Acquisition AI",
    description="AI-Based Land Acquisition Delay Prediction and Decision Support",
    version="1.0.0"
)

# Allow the local React/Vite frontend and the deployed Render frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://bhoomi-ai-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Land Acquisition AI API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


app.include_router(prediction_router)
app.include_router(what_if_router)
app.include_router(projects_router)
app.include_router(recommendations_router)
