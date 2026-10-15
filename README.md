# GIS Village Land Intelligence

Starter structure for a village land intelligence application with a React/Vite
frontend and a Flask backend.

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Copy `frontend/.env.example` to `frontend/.env` to configure the API base URL.
The Vite development server proxies `/api` to the Flask backend on port 5000.
The frontend uses the Flask API by default for login, village, parcel, dashboard,
assessment, recommendation, and report data. If the API is unavailable, it
shows an explicit warning and keeps the clearly labelled demonstration data
available. Set `VITE_USE_API=false` to use demonstration data only. The
`VITE_API_BASE_URL` value defaults to `/api`.

Run `npm run build` to verify the production bundle.

## Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

Create `backend/.env` from `backend/.env.example` before deployment and replace
the development secret with a secure value.

The backend stores records in SQLite by default and creates its tables on
startup. Illustrative records from `backend/app/demo_data.py` are seeded only
when the configured database contains no villages. Set `DATABASE_URL` to use
another SQLAlchemy-supported database. The login endpoint remains a development
placeholder and does not authenticate users.
