import pytest

from app import create_app


from app.database.mongo import initialize_database


@pytest.fixture
def client():
    app = create_app({
        "TESTING": True,
        "MONGO_DB_NAME": "gis_village_test",
    })
    initialize_database(app, force=True)
    return app.test_client()


def test_root_and_frontend_routes_do_not_return_not_found(client):
    root_response = client.get("/")
    frontend_response = client.get("/dashboard")

    assert root_response.status_code == 200
    assert "text/html" in root_response.content_type
    assert frontend_response.status_code == 200
    assert "text/html" in frontend_response.content_type


@pytest.mark.parametrize("path", ["/api", "/api/not-a-route"])
def test_unknown_api_route_returns_json_not_found(client, path):
    response = client.get(path)

    assert response.status_code == 404
    assert response.get_json() == {"message": "API endpoint not found"}


def test_dashboard_stats_are_scoped_to_selected_village(client):
    response = client.get("/api/dashboard/stats?village_id=baloda_bazar_hq")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["totalParcels"] == 5
    assert payload["district"] == "Baloda Bazar-Bhatapara, Chhattisgarh"
    assert "solarSuitableCount" in payload


def test_village_and_parcel_routes_return_baloda_bazar_data(client):
    villages_response = client.get("/api/villages")
    parcels_response = client.get("/api/land/parcels?village_id=bhatapara_rural")
    parcel_response = client.get("/api/land/parcels/BB-001")

    assert villages_response.status_code == 200
    village_ids = {village["id"] for village in villages_response.get_json()}
    assert "baloda_bazar_hq" in village_ids
    assert "bhatapara_rural" in village_ids
    assert "kasdol_rural" in village_ids

    assert parcels_response.status_code == 200
    assert all(parcel["villageId"] == "bhatapara_rural" for parcel in parcels_response.get_json())

    assert parcel_response.status_code == 200
    parcel_json = parcel_response.get_json()
    assert parcel_json["id"] == "BB-001"
    assert "ndvi" in parcel_json
    assert "slopeDeg" in parcel_json
    assert "soilPH" in parcel_json


@pytest.mark.parametrize(
    "path, key",
    [
        ("/api/assessments", "parcelId"),
        ("/api/recommendations", "parcelId"),
        ("/api/reports", "id"),
    ],
)
def test_remaining_data_routes_return_lists(client, path, key):
    response = client.get(path)

    assert response.status_code == 200
    payload = response.get_json()
    assert isinstance(payload, list)
    assert payload
    assert key in payload[0]


def test_health_endpoint_reports_ok(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_login_requires_credentials_and_returns_a_session(client):
    missing = client.post("/api/auth/login", json={})
    success = client.post("/api/auth/login", json={
        "email": "admin@village.local",
        "password": "admin",
    })

    assert missing.status_code == 400
    assert success.status_code == 200
    payload = success.get_json()
    assert payload["token"]
    assert payload["user"]["email"] == "admin@village.local"


def test_assessments_can_be_filtered_by_village(client):
    response = client.get("/api/assessments?village_id=kasdol_rural")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload
    assert all(item["villageId"] == "kasdol_rural" for item in payload)


def test_unknown_parcel_returns_not_found(client):
    response = client.get("/api/land/parcels/unknown")

    assert response.status_code == 404
    assert response.get_json()["message"] == "Parcel not found"


def test_gis_dataset_status_and_layers(client):
    status_response = client.get("/api/gis/dataset-status")
    assert status_response.status_code == 200
    status_data = status_response.get_json()
    assert "Baloda Bazar" in status_data["district"]
    assert status_data["total_sources"] == 7

    layers_response = client.get("/api/gis/layers")
    assert layers_response.status_code == 200
    assert "tiles" in layers_response.get_json()

    geojson_response = client.get("/api/gis/parcels/geojson")
    assert geojson_response.status_code == 200
    assert geojson_response.get_json()["type"] == "FeatureCollection"
