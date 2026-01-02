# Dashboard Analytics 📊

The Dashboard API aggregates data to provide real-time status counts.

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

- **Teacher**: Returns stats ONLY for their own requests (`{ teacher: userId }`).
- **Printing**: Returns stats for active jobs (`APPROVED`, `IN_PROGRESS`, `COMPLETED`).
- **Admin**: Returns global stats for the entire school.

## Optimization
Uses MongoDB Aggregation Framework (`$group`) to calculate counts in a single database query, ensuring high performance even with large datasets.
