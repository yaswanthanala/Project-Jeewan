from fastapi import APIRouter, Query
import httpx

router = APIRouter()


@router.get("/nearby")
async def nearby_centres(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: int = Query(50000, description="Search radius in meters"),
    type: str = Query("all", description="Filter: all, government, private"),
):
    """Find rehab centres near given coordinates using OpenStreetMap Overpass API."""
    overpass_query = f"""
    [out:json][timeout:10];
    (
      node["amenity"="social_facility"]["social_facility"="rehabilitation"](around:{radius},{lat},{lng});
      node["healthcare"="rehabilitation"](around:{radius},{lat},{lng});
      node["amenity"="clinic"]["healthcare:speciality"="addiction"](around:{radius},{lat},{lng});
    );
    out body;
    """

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.post(
                "https://overpass-api.de/api/interpreter",
                data={"data": overpass_query},
            )
            if r.status_code == 200:
                data = r.json()
                centres = []
                for el in data.get("elements", []):
                    tags = el.get("tags", {})
                    centre = {
                        "id": el["id"],
                        "name": tags.get("name", "Rehabilitation Centre"),
                        "lat": el["lat"],
                        "lng": el["lon"],
                        "type": tags.get("operator:type", "unknown"),
                        "phone": tags.get("phone", tags.get("contact:phone", "")),
                        "address": tags.get("addr:full", tags.get("addr:street", "")),
                        "website": tags.get("website", ""),
                    }
                    if type != "all" and centre["type"] != type:
                        continue
                    centres.append(centre)

                return {"centres": centres, "count": len(centres), "radius_km": radius // 1000}
    except Exception as e:
        pass

    # Fallback demo data if Overpass fails
    return {
        "centres": [
            {"id": 1, "name": "NIMHANS De-addiction Centre", "lat": 12.9416, "lng": 77.5869, "type": "government", "phone": "080-26995000", "address": "Bangalore", "website": "nimhans.ac.in"},
            {"id": 2, "name": "TTK Hospital - Addiction Medicine", "lat": 13.0390, "lng": 80.2700, "type": "private", "phone": "044-28293939", "address": "Chennai", "website": "ttkhospitals.com"},
            {"id": 3, "name": "Muktangan Rehabilitation Centre", "lat": 18.5204, "lng": 73.8567, "type": "government", "phone": "020-25501010", "address": "Pune", "website": ""},
        ],
        "count": 3,
        "radius_km": radius // 1000,
        "fallback": True,
    }


@router.get("/geocode")
async def reverse_geocode(lat: float, lng: float):
    """Reverse geocode coordinates to address using Nominatim."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                "https://nominatim.openstreetmap.org/reverse",
                params={"lat": lat, "lon": lng, "format": "json"},
                headers={"User-Agent": "JEEWAN-Platform/1.0"},
            )
            if r.status_code == 200:
                data = r.json()
                return {
                    "address": data.get("display_name", ""),
                    "city": data.get("address", {}).get("city", data.get("address", {}).get("town", "")),
                    "state": data.get("address", {}).get("state", ""),
                }
    except Exception:
        pass

    return {"address": f"Coordinates: {lat}, {lng}", "city": "", "state": ""}
