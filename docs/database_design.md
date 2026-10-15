# Database Design

The initial backend configuration uses SQLite by default. Set `DATABASE_URL`
to select a different SQLAlchemy-supported database. The API creates its
tables on startup and inserts the illustrative sample dataset only when the
database has no villages. Subsequent application starts retain database
changes and do not reseed existing records.

## Entities

- `users`: unique email, password hash, and role. Authentication is not yet
  connected to this table.
- `villages`: village identifier, name, district, and map center.
- `land_parcels`: village relationship, area, observed cover, status,
  verification, optional score and suggested use, access observations, update
  date, and map center.
- `assessments`: parcel relationship, status, verification, optional score,
  and update date.
- `recommendations`: parcel relationship, category, summary, and priority.
- `reports`: report metadata and summary.

Parcel status and assessment fields are stored separately to support the
existing API resource groups. The current seed values are illustrative and
should not be interpreted as verified land records.
