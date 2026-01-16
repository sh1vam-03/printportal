# API Overview 📡

The API is built with **Express.js** and follows RESTful conventions.
All endpoints are prefixed with `/api` (configured in `app.js`).

## Base URL
`http://localhost:5000/api`

## Authentication (`/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register a new Employee | Public |
| POST | `/login` | Login for all roles | Public |

## Print Requests (`/print-requests`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create a new print request | `Employee` |
| GET | `/` | Get list of requests | `Employee` (own), `ADMIN`, `PRINTING` |
| PUT | `/:id/approve` | Approve a request | `ADMIN` |
| PUT | `/:id/reject` | Reject a request | `ADMIN` |
| PUT | `/:id/status` | Update status (Start/Complete) | `PRINTING` |
| GET | `/:id/download` | Download attached file | `PRINTING` |

## Dashboard (`/dashboard`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/stats` | Get analytics counts | `Employee`, `ADMIN`, `PRINTING` |
