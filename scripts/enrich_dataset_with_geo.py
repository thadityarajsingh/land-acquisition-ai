from pathlib import Path

import pandas as pd

from backend.services.geo_service import coordinates_for_project


ROOT = Path(__file__).resolve().parents[1]
DATASET = ROOT / "ml" / "sih26017_synthetic_land_acquisition_dataset.csv"


def main():
    df = pd.read_csv(DATASET)

    coords = [
        coordinates_for_project(state, district)
        for state, district in zip(df["state"], df["district"])
    ]
    df["latitude"] = [lat for lat, _ in coords]
    df["longitude"] = [lon for _, lon in coords]
    df["geo_source"] = "synthetic_demo_district_center"

    df.to_csv(DATASET, index=False)
    print(f"Updated {len(df)} rows: {DATASET}")
    print("Added columns: latitude, longitude, geo_source")


if __name__ == "__main__":
    main()
