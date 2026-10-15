import pytest

from app import create_app


@pytest.fixture
def client():
    app = create_app({
        "TESTING": True,
        "DATABASE_URL": "sqlite:///:memory:",
    })
    return app.test_client()


def test_dashboard_stats_are_scoped_to_selected_village(client):
    response = client.get("/api/dashboard/stats?village_id=rampur")

    assert response.status_code == 200
    assert response.get_json() == {
        "totalParcels": 6,
        "potentiallyUnused": 2,
        "flaggedForAssessment": 2,
        "assessedParcels": 2,
    }


def test_village_and_parcel_routes_return_frontend_data(client):
    villages_response = client.get("/api/villages")
    parcels_response = client.get("/api/land/parcels?village_id=khed")
    parcel_response = client.get("/api/land/parcels/RV-024")

    assert villages_response.status_code == 200
    assert {village["id"] for village in villages_response.get_json()} == {
        "rampur",
        "khed",
        "sonwadi",
    }
    assert parcels_response.status_code == 200
    assert all(parcel["villageId"] == "khed" for parcel in parcels_response.get_json())
    assert parcel_response.status_code == 200
    assert parcel_response.get_json()["id"] == "RV-024"


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
    assert response.get_json() == {"status": "ok"}


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
    response = client.get("/api/assessments?village_id=khed")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload
    assert all(item["villageId"] == "khed" for item in payload)


def test_unknown_parcel_returns_not_found(client):
    response = client.get("/api/land/parcels/unknown")

    assert response.status_code == 404
    assert response.get_json()["message"] == "Parcel not found"


def test_parcel_status_filter_is_applied_by_database(client):
    response = client.get("/api/land/parcels?status=water")

    assert response.status_code == 200
    payload = response.get_json()
    assert len(payload) == 3
    assert all(parcel["status"] == "water" for parcel in payload)
