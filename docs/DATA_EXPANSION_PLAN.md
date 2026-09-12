# BhoomiIQ — Data Expansion Plan

## Purpose

The judges highlighted that the current prototype is highly dependent on the dataset. This plan expands the master land-acquisition dataset toward approximately 100 meaningful columns across geographic, environmental, land-use, social, legal, administrative, financial, infrastructure, and hazard dimensions.

## Design principle

The goal is **not** to add columns only to increase the column count. Each field should represent a plausible land-acquisition factor and should be traceable to a future data source such as land records, GIS layers, environmental datasets, project records, surveys, or remote sensing.

The expanded dataset should preserve a clean distinction between:

1. **Source/master fields** — information that can be collected before prediction.
2. **Derived features** — values calculated from source/GIS data.
3. **Prediction features** — fields available at prediction time.
4. **Target/outcome fields** — values that occur after the prediction point and must not be used as inputs when predicting delay.

## Proposed feature groups

| Group | Target count | Examples |
|---|---:|---|
| Project & location | 8 | state, district, tehsil, village, project type, area, stage |
| GIS / spatial | 15 | coordinates, elevation, slope, road/city/rail distances, terrain |
| Environmental / green zone | 15 | green zone, forest, ESZ, protected area, wetland, tree cover, clearance |
| Land use / agriculture | 10 | land-use mix, agricultural share, conversion requirement |
| Social impact | 12 | landowners, households, displacement, consent, rehabilitation |
| Ownership / legal | 12 | title verification, disputes, encumbrances, court cases, mutation |
| Administrative | 10 | departments, clearances, documentation, notification, hearings |
| Compensation / financial | 8 | value, compensation, paid percentage, disputes, claims |
| Infrastructure | 8 | utilities, road access, nearby services, infrastructure readiness |
| Natural hazards | 7 | flood, waterlogging, erosion, seismic zone, soil, drainage |
| **Master dataset** | **~105 before pruning** | |

After removing redundant or overlapping fields, the final master dataset should target **~95–100 columns**.

## Environmental / green-zone fields

Recommended fields include:

- `green_zone_status`
- `green_zone_pct`
- `forest_area_pct`
- `eco_sensitive_zone`
- `protected_area_status`
- `protected_area_distance_km`
- `wetland_present`
- `wetland_area_pct`
- `environmental_clearance_required`
- `environmental_clearance_status`
- `pollution_sensitivity`
- `biodiversity_sensitivity`
- `tree_cover_pct`
- `tree_cutting_required`
- `tree_compensation_required`

These should be treated as environmental constraints, not as arbitrary risk labels.

## Important ML rule: leakage prevention

Fields such as `is_delayed`, `delay_days`, and any outcome that is only known after the delay occurs must remain targets/outcomes rather than prediction inputs. `approval_delay_days` must also be reviewed carefully because its eligibility depends on the exact prediction time.

A stronger prediction setup is:

`pre-acquisition information → feature engineering → leakage check → XGBoost → delay-risk score`

rather than allowing actual future delay information to enter the model.

## Correlated synthetic data

If synthetic records are used for the prototype, new variables should be generated with logical relationships. Examples:

- Green-zone land → greater probability of environmental clearance → higher environmental complexity.
- More landowners → greater probability of consent/ownership issues and compensation claims.
- More displacement → greater rehabilitation/resettlement requirements.
- More court cases → higher legal complexity.
- More required clearances → higher administrative complexity.
- Poor infrastructure access → higher project implementation complexity.
- Flood/waterlogging risk → additional engineering/environmental constraints.

The synthetic generator should avoid making every column an independent random value.

## Future authoritative sources

The prototype should clearly label synthetic values as synthetic. A production version can replace or enrich them with authoritative government land records, cadastral/GIS layers, environmental-zone datasets, road/infrastructure GIS, disaster-risk layers, project records, and verified acquisition/compensation records.

## Judge response

> “The current dataset is a prototype. We expanded the data architecture beyond administrative delay variables into geographic, environmental, land-use, social, legal, financial, infrastructure and hazard factors. The master schema is designed so that synthetic prototype values can later be replaced by authoritative GIS and government data. We also separate prediction-time features from future outcomes to avoid data leakage.”
