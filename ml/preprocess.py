"""
preprocess.py
Data cleaning + preprocessing pipeline for SIH26017.
"""

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

TARGET_COLUMN = "is_delayed"
DROP_COLUMNS = ["project_id", "delay_days"]

# Prediction-time features. Outcome/leakage fields such as delay_days,
# compensation_paid_pct and resettlement_status are intentionally excluded.
NUMERIC_FEATURES = [
    "land_area_acres", "affected_families", "approval_delay_days", "legal_disputes",
    "rehab_progress_pct", "stakeholder_responsiveness_pct", "historical_performance_score",
    "departments_involved", "historical_delay_count",
    "green_zone_pct", "forest_area_pct", "tree_cover_pct", "protected_area_distance_km",
    "waterbody_distance_m", "elevation_m", "slope_degree", "distance_to_road_km",
    "distance_to_highway_km", "distance_to_railway_km", "distance_to_city_km",
    "agricultural_area_pct", "residential_area_pct", "commercial_area_pct", "industrial_area_pct",
    "landowners_count", "displaced_families", "vulnerable_households", "livelihood_dependency_pct",
    "record_completeness_pct", "required_clearances_count", "documentation_completeness_pct",
    "estimated_land_value_lakh", "market_value_variance_pct", "distance_to_school_km",
    "distance_to_hospital_km", "distance_to_market_km",
]

CATEGORICAL_FEATURES = [
    "state", "district", "project_type", "compensation_status", "possession_status",
    "documentation_status", "notification_status", "acquisition_stage",
    "green_zone_status", "eco_sensitive_zone", "wetland_present", "environmental_clearance_required",
    "tree_cutting_required", "land_use_type", "land_conversion_required", "ownership_type",
    "ownership_conflict", "title_verification_status", "encumbrance_status", "inheritance_dispute",
    "mutation_status", "boundary_dispute", "court_case_status", "public_hearing_status",
    "authority_approval_status", "gazette_notification_status", "flood_risk", "waterlogging_risk",
    "erosion_risk", "seismic_zone", "soil_type", "drainage_quality",
]


def load_raw_data(path: str) -> pd.DataFrame:
    if path.endswith(".csv"):
        return pd.read_csv(path)
    return pd.read_excel(path)


def inspect(df: pd.DataFrame) -> None:
    print("Shape:", df.shape)
    print("\nDtypes:\n", df.dtypes)
    print("\nMissing values:\n", df.isnull().sum())
    print("\nSample rows:\n", df.head())


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop_duplicates().copy()
    df = df.drop(columns=[c for c in DROP_COLUMNS if c in df.columns and c != TARGET_COLUMN])
    df = df.dropna(subset=[TARGET_COLUMN])
    for col in df.select_dtypes(include="object").columns:
        df[col] = df[col].apply(lambda value: value.strip() if isinstance(value, str) else value)
    return df


def build_pipeline() -> ColumnTransformer:
    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])
    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore")),
    ])
    return ColumnTransformer(transformers=[
        ("num", numeric_transformer, NUMERIC_FEATURES),
        ("cat", categorical_transformer, CATEGORICAL_FEATURES),
    ])


if __name__ == "__main__":
    import sys
    df = load_raw_data(sys.argv[1] if len(sys.argv) > 1 else "sih26017_synthetic_land_acquisition_dataset.csv")
    inspect(df)
