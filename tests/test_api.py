from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)

FEATURE_KEYS = [
    "land_area_acres",
    "affected_families",
    "approval_delay_days",
    "legal_disputes",
    "rehab_progress_pct",
    "stakeholder_responsiveness_pct",
    "historical_performance_score",
    "departments_involved",
    "historical_delay_count",
    "state",
    "district",
    "project_type",
    "compensation_status",
    "possession_status",
    "documentation_status",
    "notification_status",
    "acquisition_stage",
]


def project_features(project):
    return {key: project.get(key) for key in FEATURE_KEYS}


def get_project(project_id="LA-0001"):
    response = client.get(f"/projects/{project_id}")
    assert response.status_code == 200
    return response.json()


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json().get("status") == "healthy"


def test_projects_returns_real_dataset():
    response = client.get("/projects")
    assert response.status_code == 200

    data = response.json()
    assert "projects" in data
    assert len(data["projects"]) == 1200
    assert data["projects"][0]["project_id"].startswith("LA-")


def test_project_detail():
    data = get_project()
    assert data["project_id"] == "LA-0001"
    assert "land_area_acres" in data
    assert "legal_disputes" in data


def test_missing_project_returns_404():
    response = client.get("/projects/LA-9999")
    assert response.status_code == 404


def test_prediction_contract():
    project = get_project()
    response = client.post("/predict", json=project_features(project))

    assert response.status_code == 200
    result = response.json()
    assert 0 <= result["risk_score"] <= 1
    assert result["risk_category"] in {"Low", "Medium", "High"}
    assert isinstance(result["predicted_delayed"], bool)


def test_prediction_explainability_contract():
    project = get_project()
    response = client.post("/predict/explain", json=project_features(project))

    assert response.status_code == 200
    factors = response.json()["top_factors"]
    assert isinstance(factors, dict)
    assert len(factors) > 0
    assert all(isinstance(key, str) for key in factors)
    assert all(isinstance(value, (int, float)) for value in factors.values())


def test_what_if_uses_same_prediction_pipeline():
    project = get_project()
    baseline = project_features(project)
    scenario = baseline.copy()
    scenario["legal_disputes"] = 0

    response = client.post(
        "/what-if",
        json={"baseline": baseline, "scenario": scenario},
    )

    assert response.status_code == 200
    result = response.json()
    assert "originalScore" in result
    assert "simulatedScore" in result
    assert "scoreDelta" in result
    assert "originalDelay" in result
    assert "simulatedDelay" in result
    assert result["modelScenario"] is True


def test_project_recommendations_are_advisory_and_project_specific():
    response = client.get("/recommendations/LA-0001")

    assert response.status_code == 200
    data = response.json()
    assert data["project_id"] == "LA-0001"
    assert data["count"] >= 1
    assert data["advisory"] is True
    assert data["engine"] == "rule-based risk-factor recommendations"

    recommendation = data["recommendations"][0]
    for key in ["title", "action", "basis", "timeframe", "urgency"]:
        assert key in recommendation


def test_missing_recommendation_project_returns_404():
    response = client.get("/recommendations/LA-9999")
    assert response.status_code == 404
