# GIS Documentation

## Purpose

The GIS module provides a geographic view of project locations and a project-level risk overlay. It helps users connect model risk to geographic context.

## Implementation

The primary component is:

```text
src/components/dashboard/GISMap.jsx
```

The application also contains a cadastral register component for parcel information.

The GIS map dynamically loads:

- Leaflet 1.9.4
- Leaflet MarkerCluster 1.5.3
- OpenStreetMap tiles

## GIS dataset

The map loads `/gis-demo.csv` from the frontend public assets and builds an in-memory district index. Coordinates are filtered to an India bounding box before they can be used.

Backend project records are joined to the GIS dataset by normalized state + district + project type, then by normalized state + district. This prevents synthetic backend coordinates from relocating a project to an unrelated place.

Matching priority:

1. state + normalized district
2. state + project type

District normalization removes spaces/non-alphanumeric characters and trailing `urban`/`rural` suffixes.

## Coordinates

If a project has valid latitude/longitude values, the map uses them directly.

If coordinates are missing or invalid, the component uses a state-level reference center. These fallback centers are visualization aids and are **not cadastral boundaries or surveyed coordinates**.

## Project markers

Projects are displayed as clustered circle markers. Marker color is derived from the current risk score:

- `< 40` — Low Risk
- `40–<70` — Medium Risk
- `>= 70` — High Risk

Selecting a marker calls the same project-selection handler used by the dashboard.

## What-If synchronization

`App.jsx` passes both the baseline prediction risk and the simulated What-If risk into `GISMap`.

When a selected project has a simulated score, the GIS layer uses that score for the selected project's visualization. This keeps the map and What-If comparison synchronized.

## Parcel geometry

The map no longer invents parcel polygons when geometry is absent. Cadastral records can still be shown in the register, but polygon rendering requires actual parcel geometry from the backend.

The cadastral register explicitly identifies demo geometry when official cadastral parcel boundaries are unavailable.

## Search and interaction

The GIS map clusters project markers, keeps the map constrained to the India region, fits the initial view to the project set, and lets users locate the selected project. Clicking a project marker selects the corresponding backend project.

## Data quality requirements for a real deployment

For official use, replace prototype GIS inputs with authoritative geospatial data containing, where appropriate:

- surveyed latitude/longitude
- official parcel identifiers
- cadastral polygon geometry
- coordinate reference system metadata
- authoritative administrative boundaries
- source/version/date metadata

Do not present state-level fallback points or generated polygons as official cadastral geometry.

## External map dependencies

Leaflet, MarkerCluster, and OpenStreetMap assets are loaded over the network. If those external assets fail, the dashboard should remain usable even though the map may not initialize.
