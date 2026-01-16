# Dashboard Analytics 📊

The **PrintPortal** Dashboard API aggregates data to provide real-time status counts.

## Endpoint: `GET /api/dashboard/stats`
Calculates counts for:
- `total`
- `pending`
- `approved`
- `rejected`
- `inProgress`
- `completed`

## Logic (`dashboard.controller.js`)
The response is personalized based on `req.user.role`:

- **Employee**: Returns stats ONLY for their own requests (`{ Employee: userId }`).
- **Printing**: Returns stats for active jobs (`APPROVED`, `IN_PROGRESS`, `COMPLETED`).
- **Admin**: Returns global stats for the entire organization.

## Optimization
Uses MongoDB Aggregation Framework (`$group`) to calculate counts in a single database query, ensuring high performance even with large datasets.
