# Client Documentation 🖥️

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)

The **PrintPortal** client is a responsive, single-page application (SPA) designed with a premium, mobile-first aesthetic.

---

## 📂 Project Structure

```text
client/src/
├── components/          # 🧩 Reusable building blocks
│   ├── layout/          #    Sidebar, Navbar, Layout wrapper
│   └── ui/              #    Button, Card, Modal, Input
├── context/             # 🌐 Global State (Auth, Toast)
├── pages/               # 📄 Views
│   ├── admin/           #    Admin-specific dashboards
│   ├── auth/            #    Login & Signup
│   ├── printing/        #    Printing Dept dashboards
│   └── employee/        #    Employee dashboards
├── services/            # 🔌 Axios instance & API calls
└── App.jsx              # 🚦 Main routing configuration
```

## 🏗️ Core Systems

| System | Description | Documentation |
|--------|-------------|---------------|
| **Components** | Reusable UI library and layout patterns. | [View Docs](./components/README.md) |
| **Pages** | Dashboard breakdowns per role. | [View Docs](./pages.md) |
| **Routing** | Auth guards and role-based redirect logic. | [View Docs](./routing.md) |

## 🌟 Key Features
- **Mobile-First Design**: Fully responsive navigation with slide-out drawers.
- **Real-time Feedback**: Socket.io powered toasts and status updates.
- **Secure Access**: JWT-based protected routes.