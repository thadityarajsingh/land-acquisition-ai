"""
Expand the original SIH26017 dataset without changing any original values.

Usage:
    python ml/expand_dataset.py

Input:
    ml/sih26017_synthetic_land_acquisition_dataset.csv
Output:
    ml/sih26017_enhanced_land_acquisition_dataset.csv

The original 20 columns are copied exactly. Added columns are synthetic
prototype features and must not be presented as official cadastral data.
"""

from pathlib import Path
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent
INPUT = ROOT / "sih26017_synthetic_land_acquisition_dataset.csv"
OUTPUT = ROOT / "sih26017_enhanced_land_acquisition_dataset.csv"


def expand(df: pd.DataFrame) -> pd.DataFrame:
    rng = np.random.default_rng(26017)
    n = len(df)
    noise = lambda scale=1.0: rng.normal(0, scale, n)
    clip = lambda x, lo, hi: np.clip(x, lo, hi)

    # Stable correlations with the original SIH26017 fields.
    legal = df["legal_disputes"].to_numpy()
    families = df["affected_families"].to_numpy()
    delay = df["approval_delay_days"].to_numpy()
    response = df["stakeholder_responsiveness_pct"].to_numpy()
    rehab = df["rehab_progress_pct"].to_numpy()
    area = df["land_area_acres"].to_numpy()
    perf = df["historical_performance_score"].to_numpy()

    out = df.copy()
    out["green_zone_status"] = np.where(rng.random(n) < clip(0.10 + legal * 0.02, 0.02, 0.25), "Yes", "No")
    out["green_zone_pct"] = np.round(clip(8 + legal * 7 + rng.uniform(0, 35, n), 0, 90), 1)
    out["forest_area_pct"] = np.round(clip(4 + out["green_zone_pct"] * 0.35 + noise(4), 0, 65), 1)
    out["tree_cover_pct"] = np.round(clip(6 + out["forest_area_pct"] * 0.55 + noise(5), 0, 75), 1)
    out["protected_area_distance_km"] = np.round(clip(1 + rng.gamma(2.2, 3.0, n), 0.1, 50), 2)
    out["eco_sensitive_zone"] = np.where(out["green_zone_pct"] > 45, "Yes", "No")
    out["wetland_present"] = np.where(rng.random(n) < 0.12, "Yes", "No")
    out["waterbody_distance_m"] = np.round(clip(rng.gamma(2.0, 350, n), 20, 5000), 0)
    out["environmental_clearance_required"] = np.where((out["green_zone_pct"] > 35) | (out["eco_sensitive_zone"] == "Yes"), "Yes", "No")
    out["environmental_clearance_status"] = np.where(out["environmental_clearance_required"] == "Yes", np.where(delay > 60, "Pending", "Obtained"), "Not Required")
    out["tree_cutting_required"] = np.where(out["tree_cover_pct"] > 20, "Yes", "No")
    out["tree_compensation_required"] = np.where(out["tree_cutting_required"] == "Yes", "Yes", "No")

    out["elevation_m"] = np.round(50 + rng.gamma(2.0, 90, n), 1)
    out["slope_degree"] = np.round(clip(rng.gamma(1.7, 3.0, n), 0.1, 35), 1)
    out["distance_to_road_km"] = np.round(clip(rng.gamma(1.5, 0.8, n), 0.05, 20), 2)
    out["distance_to_highway_km"] = np.round(clip(out["distance_to_road_km"] + rng.gamma(1.5, 1.2, n), 0.1, 40), 2)
    out["distance_to_railway_km"] = np.round(clip(rng.gamma(1.7, 2.0, n), 0.1, 40), 2)
    out["distance_to_city_km"] = np.round(clip(rng.gamma(1.8, 5.0, n), 0.2, 80), 2)
    out["terrain_type"] = np.where(out["slope_degree"] > 12, "Hilly", np.where(out["slope_degree"] > 5, "Undulating", "Plain"))

    land = rng.choice(["Agricultural", "Residential", "Commercial", "Industrial", "Mixed"], n, p=[.43,.24,.08,.10,.15])
    out["land_use_type"] = land
    out["agricultural_area_pct"] = np.round(clip(np.where(land == "Agricultural", 55, 15) + noise(12), 0, 95), 1)
    out["residential_area_pct"] = np.round(clip(np.where(land == "Residential", 55, 12) + noise(10), 0, 90), 1)
    out["commercial_area_pct"] = np.round(clip(np.where(land == "Commercial", 40, 8) + noise(7), 0, 80), 1)
    out["industrial_area_pct"] = np.round(clip(np.where(land == "Industrial", 50, 7) + noise(7), 0, 85), 1)
    out["land_conversion_required"] = np.where(out["land_use_type"].isin(["Agricultural", "Mixed"]), "Yes", "No")
    out["land_conversion_status"] = np.where(out["land_conversion_required"] == "Yes", np.where(delay > 70, "Pending", "In Progress"), "Not Required")

    out["landowners_count"] = np.maximum(1, np.round(families * rng.uniform(.7, 1.4, n)).astype(int))
    out["displaced_families"] = np.maximum(0, np.round(families * rng.uniform(.55, .95, n)).astype(int))
    out["vulnerable_households"] = np.minimum(out["displaced_families"], np.round(out["displaced_families"] * rng.uniform(.05, .35, n)).astype(int))
    out["livelihood_dependency_pct"] = np.round(clip(np.where(land == "Agricultural", 70, 35) + noise(12), 0, 100), 1)
    out["consent_status"] = np.where(response >= 75, "Mostly Consented", np.where(response >= 50, "Partial Consent", "Low Consent"))
    out["opposition_level"] = np.where((legal >= 2) | (response < 45), "High", np.where(response < 70, "Medium", "Low"))
    out["rehabilitation_required"] = np.where(out["displaced_families"] > 0, "Yes", "No")
    out["resettlement_status"] = np.where(out["rehabilitation_required"] == "Yes", np.where(rehab >= 70, "Advanced", np.where(rehab >= 35, "In Progress", "Not Started")), "Not Required")

    out["ownership_type"] = rng.choice(["Individual", "Joint", "Institutional", "Government"], n, p=[.55,.25,.08,.12])
    out["ownership_conflict"] = np.where(legal >= 2, "Yes", np.where(legal == 1, "Possible", "No"))
    out["title_verification_status"] = np.where(legal == 0, "Verified", np.where(legal == 1, "Under Review", "Disputed"))
    out["title_defect_flag"] = np.where(legal >= 2, "Yes", "No")
    out["encumbrance_status"] = np.where(legal >= 2, "Present", np.where(legal == 1, "Possible", "Clear"))
    out["inheritance_dispute"] = np.where((legal >= 2) & (rng.random(n) < .55), "Yes", "No")
    out["mutation_status"] = np.where(legal == 0, "Updated", "Pending")
    out["record_completeness_pct"] = np.round(clip(92 - legal * 15 + noise(5), 20, 100), 1)
    out["boundary_dispute"] = np.where(legal >= 2, "Yes", "No")
    out["court_case_status"] = np.where(legal >= 2, "Active", np.where(legal == 1, "Possible", "None"))

    out["required_clearances_count"] = np.maximum(1, np.round(2 + delay / 35 + rng.uniform(0, 3, n)).astype(int))
    out["clearances_obtained_count"] = np.minimum(out["required_clearances_count"], np.maximum(0, np.round(out["required_clearances_count"] - delay / 80 + rng.uniform(0, 1.5, n)).astype(int)))
    out["public_hearing_status"] = np.where(response >= 65, "Completed", "Pending")
    out["authority_approval_status"] = np.where(delay > 90, "Pending", "Approved")
    out["gazette_notification_status"] = df["notification_status"]
    out["documentation_completeness_pct"] = np.round(clip(np.where(df["documentation_status"] == "Complete", 95, 60) + noise(5), 20, 100), 1)

    out["estimated_land_value_lakh"] = np.round(8 + area * rng.uniform(3, 14, n), 2)
    out["estimated_compensation_lakh"] = np.round(out["estimated_land_value_lakh"] * rng.uniform(1.0, 2.2, n), 2)
    out["compensation_paid_pct"] = np.where(df["compensation_status"] == "Fully Paid", 100, np.where(df["compensation_status"] == "Mostly Paid", 80, np.where(df["compensation_status"] == "Partially Paid", 45, 0)))
    out["compensation_dispute"] = np.where(df["compensation_status"].isin(["Partially Paid", "Not Started"]), "Possible", "No")
    out["market_value_variance_pct"] = np.round(clip(noise(12), -35, 45), 1)
    out["additional_compensation_claim"] = np.where(out["compensation_dispute"] == "Possible", "Yes", "No")

    out["electricity_infrastructure_present"] = np.where(rng.random(n) < .72, "Yes", "No")
    out["water_infrastructure_present"] = np.where(rng.random(n) < .58, "Yes", "No")
    out["utility_shift_required"] = np.where((out["electricity_infrastructure_present"] == "Yes") | (out["water_infrastructure_present"] == "Yes"), "Yes", "No")
    out["utility_shift_status"] = np.where(out["utility_shift_required"] == "Yes", np.where(delay > 60, "Pending", "Planned"), "Not Required")
    out["distance_to_school_km"] = np.round(clip(rng.gamma(1.5, 1.2, n), .1, 15), 2)
    out["distance_to_hospital_km"] = np.round(clip(rng.gamma(1.8, 2.0, n), .2, 30), 2)
    out["distance_to_market_km"] = np.round(clip(rng.gamma(1.7, 1.8, n), .1, 25), 2)

    out["flood_risk"] = np.where(out["waterbody_distance_m"] < 300, "High", np.where(out["waterbody_distance_m"] < 900, "Medium", "Low"))
    out["waterlogging_risk"] = np.where(out["flood_risk"] == "High", "High", np.where(out["flood_risk"] == "Medium", "Medium", "Low"))
    out["erosion_risk"] = np.where(out["slope_degree"] > 15, "High", np.where(out["slope_degree"] > 7, "Medium", "Low"))
    out["seismic_zone"] = rng.choice(["II", "III", "IV", "V"], n, p=[.35,.40,.20,.05])
    out["soil_type"] = rng.choice(["Alluvial", "Black", "Red", "Laterite", "Sandy"], n)
    out["drainage_quality"] = np.where(out["waterlogging_risk"] == "High", "Poor", np.where(out["waterlogging_risk"] == "Medium", "Moderate", "Good"))

    # Demo-only derived score. It is explicitly not the training target.
    score = (delay * .22 + legal * 8 + (100 - response) * .18 + (100 - perf) * .12 + (100 - rehab) * .10 + (out["green_zone_pct"] * .08) + (out["title_defect_flag"] == "Yes") * 8 + (out["compensation_dispute"] == "Possible") * 5)
    out["risk_score_demo"] = np.round(clip(score, 0, 100), 1)
    out["risk_band_demo"] = pd.cut(out["risk_score_demo"], [-1, 40, 70, 101], labels=["Low", "Medium", "High"]).astype(str)
    out["data_status"] = "SYNTHETIC_SIH26017_ENHANCED"
    out["provenance_note"] = "Synthetic prototype features appended to the original SIH26017 dataset; not official cadastral data."

    return out


if __name__ == "__main__":
    source = pd.read_csv(INPUT)
    result = expand(source)
    result.to_csv(OUTPUT, index=False)
    print(f"Wrote {len(result)} rows and {len(result.columns)} columns to {OUTPUT}")
    print("Original columns preserved:", len(source.columns))
