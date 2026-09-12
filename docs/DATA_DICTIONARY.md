# Data Dictionary

This document describes the fields in `ml/sih26017_synthetic_land_acquisition_dataset.csv` and the role each field plays in the prototype.

> **Data status:** the current dataset is synthetic SIH26017 prototype data. It must not be interpreted as official government land records.

## Fields

| Field | Type | Meaning | Model input? |
|---|---|---|---|
| `project_id` | string | Unique project identifier used by the application | No |
| `state` | categorical | State associated with the project | Yes |
| `district` | categorical | District associated with the project | Yes |
| `project_type` | categorical | Infrastructure/project category | Yes |
| `land_area_acres` | numeric | Land area involved in acres | Yes |
| `affected_families` | numeric | Number of affected families recorded for the project | Yes |
| `compensation_status` | categorical | Current compensation/payment status | Yes |
| `approval_delay_days` | numeric | Recorded approval delay in days | Yes |
| `legal_disputes` | numeric | Number of recorded legal disputes | Yes |
| `possession_status` | categorical | Status of land possession | Yes |
| `rehab_progress_pct` | numeric | Rehabilitation progress percentage | Yes |
| `stakeholder_responsiveness_pct` | numeric | Stakeholder responsiveness percentage | Yes |
| `historical_performance_score` | numeric | Historical performance score for the relevant project/process context | Yes |
| `documentation_status` | categorical | Completeness/status of documentation | Yes |
| `notification_status` | categorical | Status of required notification activity | Yes |
| `departments_involved` | numeric | Number of departments involved | Yes |
| `acquisition_stage` | categorical | Current acquisition stage | Yes |
| `historical_delay_count` | numeric | Historical number of delay events recorded | Yes |
| `is_delayed` | binary | Target indicating whether the record is labelled delayed | **Target; excluded from inputs** |
| `delay_days` | numeric | Recorded delay duration | **Leakage field; excluded from inputs** |
| `latitude` | numeric | Geographic latitude used by the GIS prototype | No |
| `longitude` | numeric | Geographic longitude used by the GIS prototype | No |
| `geo_source` | string | Describes the source/status of the coordinate | No |

## Preprocessing

Numeric model features are median-imputed and scaled. Categorical model features are most-frequent-imputed and one-hot encoded. The fitted preprocessing pipeline is persisted for backend inference so training-time and inference-time transformations remain aligned.

## Target and leakage controls

`is_delayed` is the prediction target. `delay_days` is excluded because it is an outcome field that would leak information about the delay being predicted. Project identifiers and GIS metadata are also kept outside the model feature set.

See [`ML.md`](./ML.md) and [`../ml/MODEL_EVALUATION.md`](../ml/MODEL_EVALUATION.md) for the full modeling context.