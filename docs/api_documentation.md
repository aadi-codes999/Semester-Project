# API Documentation

The frontend API base URL is configured with `VITE_API_BASE_URL` (default:
`http://localhost:5000/api`). Responses use JSON. Collection endpoints return
JSON arrays; object endpoints return a JSON object or a `404` response with a
`message`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/login` | Development placeholder; requires `email` and `password`, but does not authenticate users. |
| `GET` | `/dashboard/stats` | Parcel counts; optional `village_id` query parameter. |
| `GET` | `/villages` | List villages; optional `village_id` query parameter. |
| `GET` | `/land/parcels` | List parcels; optional `village_id` and `status` query parameters. |
| `GET` | `/land/parcels/{parcel_id}` | Read one parcel. |
| `GET` | `/assessments` | List parcel assessments. |
| `GET` | `/assessments/{parcel_id}` | Read one parcel assessment. |
| `GET` | `/recommendations` | List parcel recommendations. |
| `GET` | `/recommendations/{parcel_id}` | Read one parcel recommendation. |
| `GET` | `/reports` | List report metadata. |

Parcel responses retain the frontend's camel-case fields, including
`villageId`, `statusLabel`, `suggestedUse`, `roadAccess`, and `waterProximity`.
The backend stores sample records in its configured SQLAlchemy database; the
sample values are illustrative, not verified land records.
