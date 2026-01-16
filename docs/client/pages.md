# Pages & Dashboards 📄

The application is divided into distinct dashboards for each user role.

## Public Pages
- **Login (`/login`)**: Entry point. Users select their role to sign in.
- **Signup (`/signup`)**: Registration page (Employee only).

## Employee Dashboard (`/employee`)
- **My Requests**: The landing page. Shows a list of the employee's print jobs with live status updates.
- **Create Request**: A modal form to upload a file and specify print details (copies, double-sided, delivery).

## Admin Dashboard (`/admin`)
- **Approve Requests**: The main view for admins.
- **Features**:
   - View pending requests.
   - Approve or Reject jobs.
   - Monitor "All Jobs" status.

## Printing Dashboard (`/printing`)
- **Job Queue**: The workspace for the printing department.
- **Workflow**:
   1. Download the file.
   2. Mark as `In Progress`.
   3. Mark as `Completed`.
