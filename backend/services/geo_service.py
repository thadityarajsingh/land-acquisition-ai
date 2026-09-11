from __future__ import annotations

from typing import Mapping


# Representative district-center coordinates for the synthetic/demo dataset.
# These are intentionally demo coordinates, not cadastral survey coordinates.
DISTRICT_COORDINATES: Mapping[str, tuple[float, float]] = {
    "Bengaluru Urban": (12.9716, 77.5946),
    "Mysuru": (12.2958, 76.6394),
    "Belagavi": (15.8497, 74.4977),
    "Hubballi": (15.3647, 75.1240),
    "Mangaluru": (12.9141, 74.8560),
    "Nashik": (19.9975, 73.7898),
    "Aurangabad": (19.8762, 75.3433),
    "Thane": (19.2183, 72.9781),
    "Nagpur": (21.1458, 79.0882),
    "Pune": (18.5204, 73.8567),
    "Mumbai": (19.0760, 72.8777),
    "Ganjam": (19.3870, 84.6747),
    "Puri": (19.8135, 85.8312),
    "Sambalpur": (21.4669, 83.9812),
    "Khordha": (20.1809, 85.6190),
    "Cuttack": (20.4625, 85.8830),
    "Nalanda": (25.1357, 85.4433),
    "Gaya": (24.7914, 85.0002),
    "Muzaffarpur": (26.1209, 85.3647),
    "Patna": (25.5941, 85.1376),
    "Tiruchirappalli": (10.7905, 78.7047),
    "Salem": (11.6643, 78.1460),
    "Madurai": (9.9252, 78.1198),
    "Chennai": (13.0827, 80.2707),
    "Coimbatore": (11.0168, 76.9558),
    "Gwalior": (26.2183, 78.1828),
    "Ujjain": (23.1765, 75.7885),
    "Jabalpur": (23.1815, 79.9864),
    "Indore": (22.7196, 75.8577),
    "Bhopal": (23.2599, 77.4126),
    "Surat": (21.1702, 72.8311),
    "Bhavnagar": (21.7645, 72.1519),
    "Vadodara": (22.3072, 73.1812),
    "Ahmedabad": (23.0225, 72.5714),
    "Rajkot": (22.3039, 70.8022),
    "Jaipur": (26.9124, 75.7873),
    "Ajmer": (26.4499, 74.6399),
    "Jodhpur": (26.2389, 73.0243),
    "Udaipur": (24.5854, 73.7125),
    "Kota": (25.2138, 75.8648),
    "Agra": (27.1767, 78.0081),
    "Lucknow": (26.8467, 80.9462),
    "Mathura": (27.4924, 77.6737),
    "Varanasi": (25.3176, 82.9739),
    "Kolkata": (22.5726, 88.3639),
    "Darjeeling": (27.0410, 88.2663),
    "Nadia": (23.4070, 88.3650),
    "Hooghly": (22.8950, 88.3890),
    "Howrah": (22.5958, 88.2636),
}

STATE_CENTROIDS: Mapping[str, tuple[float, float]] = {
    "Karnataka": (15.3173, 75.7139),
    "Maharashtra": (19.7515, 75.7139),
    "Odisha": (20.9517, 85.0985),
    "Bihar": (25.0961, 85.3131),
    "Tamil Nadu": (11.1271, 78.6569),
    "Madhya Pradesh": (22.9734, 78.6569),
    "Gujarat": (22.2587, 71.1924),
    "Rajasthan": (27.0238, 74.2179),
    "Uttar Pradesh": (26.8467, 80.9462),
    "West Bengal": (22.9868, 87.8550),
}


def coordinates_for_project(state: str | None, district: str | None) -> tuple[float | None, float | None]:
    if district and district in DISTRICT_COORDINATES:
        return DISTRICT_COORDINATES[district]
    if state and state in STATE_CENTROIDS:
        return STATE_CENTROIDS[state]
    return None, None


def enrich_project_geo(project):
    """Add synthetic/demo project coordinates without changing ML features."""
    state = project.get("state")
    district = project.get("district")
    latitude, longitude = coordinates_for_project(state, district)
    project["latitude"] = latitude
    project["longitude"] = longitude
    project["geo_source"] = "synthetic_demo_district_center"
    return project
