# Real-Data Parcel Schema and Provenance Plan

## Objective

The judges asked for the project to be less dependent on a small synthetic feature set. The next dataset should use **real, source-traceable land and geospatial records**. We must not manufacture parcel coordinates, cadastral boundaries, ownership identifiers, environmental statuses, or other facts and present them as real.

The target master schema is approximately 95–100 columns, but a field is only considered populated when it has a traceable source.

## Pilot geography

Start with **Mathura district, Uttar Pradesh**. The Uttar Pradesh government GeoDashboard currently exposes village/cadastral-map digitization and georeferencing status for Mathura tehsils including Chata, Govardhan, Mahavan, Mant and Mathura. The public report identifies village codes and whether maps are linked to Bhu-Naksha and georeferenced.

The official Mathura report currently shows 891 revenue villages, 905 village Khatauni records, 756 scannable/scanned/verified/linked villages, and 726 georeferenced villages in the district summary. This is a source-coverage fact, not a claim that every parcel has been obtained for this project.

## Authoritative/source hierarchy

### Tier 1 — land records and cadastral geometry

- Uttar Pradesh Bhulekh / Board of Revenue: Records of Rights, Khatauni and land-record services.
- Uttar Pradesh GeoDashboard: cadastral-map digitization, Bhu-Naksha linkage and georeferencing status.
- Bhu-Naksha / DILRMP sources: parcel/cadastral geometry and ULPIN where legitimately available.
- NAKSHA: GIS-integrated urban/peri-urban parcel mapping where the relevant pilot area is covered.

### Tier 2 — official geospatial/environmental layers

- Government/ISRO/NRSC Bhuvan layers where the relevant dataset is publicly available and licensing permits use.
- MoEFCC and other official environmental GIS sources for protected areas, forests and environmental constraints.
- Official disaster/flood/hazard layers where available.

### Tier 3 — official demographic and infrastructure sources

- Census of India / District Census Handbooks.
- Government transport, road, railway, utility and infrastructure datasets where available.

### Tier 4 — supplementary sources

Third-party aggregators may be used for discovery/cross-checking only. They must not replace an authoritative land-record source for parcel identity, ownership, legal status or cadastral geometry.

## Target schema (~100 fields)

### Identity and administration

`parcel_id, project_id, state, district, tehsil, village, village_code, gram_panchayat, pincode, acquisition_stage`

### Geometry and spatial context

`latitude, longitude, geometry_source, geometry_accuracy_m, cadastral_map_available, cadastral_map_georeferenced, parcel_area_acres, parcel_area_hectares, perimeter_m, centroid_latitude, centroid_longitude, elevation_m, slope_degree, terrain_type, distance_to_road_m, distance_to_highway_m, distance_to_railway_m, distance_to_city_km, distance_to_waterbody_m, distance_to_settlement_m`

### Land use and agriculture

`land_use_type, land_cover_class, agricultural_land_pct, irrigated_area_pct, net_sown_area_ha, fallow_area_ha, forest_area_pct, pasture_area_pct, wasteland_area_pct, conversion_required`

### Environmental / green-zone constraints

`green_zone_status, green_zone_pct, eco_sensitive_zone, protected_area_status, protected_area_distance_km, forest_distance_km, wetland_present, wetland_distance_m, waterbody_present, environmental_clearance_required, environmental_clearance_status, tree_cover_pct, tree_cutting_required, biodiversity_sensitivity, environmental_risk_score`

### Social impact

`affected_households, affected_families, displaced_families, landowner_count, vulnerable_households, livelihood_dependency_pct, consent_percentage, resettlement_required, rehabilitation_required, rehabilitation_status, public_opposition_level, social_impact_score`

### Ownership and legal

`ownership_type, title_verification_status, title_defects_count, mutation_status, encumbrance_status, boundary_dispute, ownership_conflict, inheritance_dispute, court_case_count, land_record_digitized, record_completeness_pct, legal_risk_score`

### Administration and approvals

`departments_involved, clearances_required, clearances_completed, approval_authorities_count, document_completeness_pct, notification_status, public_hearing_required, public_hearing_status, approval_status, administrative_complexity_score`

### Compensation and financial

`estimated_land_value, compensation_estimate, compensation_paid_pct, compensation_dispute, compensation_claim_count, market_value_variance_pct, additional_compensation_required, financial_risk_score`

### Infrastructure and hazards

`electricity_available, water_supply_available, utility_shift_required, existing_infrastructure_pct, nearest_hospital_distance_km, nearest_school_distance_km, nearest_market_distance_km, flood_risk, flood_zone, waterlogging_risk, erosion_risk, seismic_zone, soil_type, drainage_condition, infrastructure_risk_score`

### Prediction target / audit fields

`is_delayed, delay_days, data_as_of_date, source_record_id, source_name, source_url, source_date, source_resolution, source_confidence`

> The final feature count must be audited after deduplication and before model training. Target/outcome fields and post-outcome fields must not be passed to the predictor.

## Real-data rule

A value is either:

1. directly observed in an authoritative source,
2. deterministically derived from source data (with the derivation documented), or
3. unavailable (`NA`).

**Do not replace missing real values with fabricated coordinates or random numbers.**

## Parcel spacing rule

For the GIS layer, adjacent parcel positions must come from the actual parcel geometry/centroid. We must not generate artificial offsets to make parcels appear separated. If the official geometry is unavailable, the parcel should remain unmapped rather than being assigned a fake latitude/longitude.

## ML leakage rule

`is_delayed` and `delay_days` are outcomes. Any field that is only known after the prediction point must be excluded from model inputs. `approval_delay_days` must be reviewed against the exact prediction-time definition before it is used.

## Current verified pilot evidence

The UP government GeoDashboard provides real Mathura village records and village codes, plus cadastral-map verification/linkage/georeferencing status. The Mathura district report lists Chata, Govardhan, Mahavan, Mant and Mathura tehsils and their map/village coverage. Individual village reports expose village codes and map-georeferencing status.

The UP Bhulekh portal states that land-related records including Khatauni, plot/gata litigation/sale status, Bhu-Naksha and mutation-related information are available through the state land-record services.

## Implementation sequence

1. Obtain/legitimately export the authoritative parcel/cadastral data for the pilot area.
2. Preserve the original parcel geometry and source identifiers.
3. Add official village/census/infrastructure/environmental layers using spatial joins.
4. Compute only deterministic derived distances/areas/percentages.
5. Attach provenance metadata to every source-backed field.
6. Run completeness, geometry, duplicate and CRS validation.
7. Build a prediction-time feature whitelist to prevent leakage.
8. Retrain and reevaluate XGBoost/SHAP using only eligible real features.
9. Update the API, GIS and documentation after the real-data pipeline is validated.

## Important claim boundary

Until the authoritative parcel export and all required source layers have actually been ingested, BhoomiIQ must continue to label its current ML dataset as synthetic/prototype. Real government portal availability or coverage statistics do **not** mean that BhoomiIQ has already ingested those records.
