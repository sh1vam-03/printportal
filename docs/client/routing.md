# Routing & Access Control 🚦

Routing in **PrintPortal** is managed by `react-router-dom` and secured by a custom `ProtectedRoutes` wrapper.

## Security Model
Routes are protected based on the `user.role` stored in the Auth Context.

### ProtectedRoute Logic
The `ProtectedRoutes` component accepts an `allowedRoles` array prop.
- **If Not Logged In**: Redirects to `/login`.
- **If Logged In but Wrong Role**: Redirects to the `unauthorized` page (or user's home).
- **If Authorized**: Renders the child component wrapped in the main `Layout`.

## Route Configuration (`App.jsx`)

| Path | Component | Allowed Roles |
|------|-----------|---------------|
| `/` | `Login` | Public |
| `/login` | `Login` | Public |
| `/signup` | `Signup` | Public |
| `/teacher/*` | `TeacherRoutes` | `TEACHER` |
| `/admin/*` | `AdminRoutes` | `ADMIN` |
| `/printing/*` | `PrintingRoutes` | `PRINTING_MANAGER` |

## Handling 404
A catch-all route (`*`) renders the `NotFound` component, ensuring users don't see a broken page if they visit an invalid URL.
