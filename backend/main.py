from fastapi import FastAPI

from backend.routes.prediction import router as prediction_router
from backend.routes.what_if import router as what_if_router
from backend.routes.projects import router as projects_router
from backend.routes.recommendations import router as recommendations_router

app = FastAPI(
    title="Land Acquisition AI",
    description="AI-Based Land Acquisition Delay Prediction and Decision Support",
    version="1.0.0"
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
