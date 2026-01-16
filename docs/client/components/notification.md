# Notification System 🔔

The application features a robust notification system powered by `ToastContext`.

## components/ui/Toast.jsx
The visual component that renders the notification.

**Styles:**
- **Success**: Green (e.g., "Request Approved").
- **Error**: Red (e.g., "Login Failed").
- **Info**: Blue.
- **Warning**: Yellow (e.g., "Printing Started").

**Design:**
Premium aesthetic with icons, glass-morphism effect, and slide-in animation.

## context/ToastContext.jsx
Provides the `showToast` function globally.

**Usage:**
```javascript
const { showToast } = useContext(ToastContext);
showToast("Operation successful", "success");
```

## Socket Integration
The application listens for real-time events to trigger notifications without user action.

**Employee Dashboard (`MyRequests.jsx`):**
- Listens for `requestStatusUpdated`.
- Triggers a toast: "Your request has been [Approved/Rejected]".

**Admin Dashboard:**
- Listens for `newPrintRequest`.
- Triggers a notification bell alert.
