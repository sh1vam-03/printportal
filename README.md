# PrintPortal - A WEB-BASED PRINT MANAGEMENT SYSTEM (MINI SAAS PLATFORM) 🖨️

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Headless-47A248?logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-010101?logo=socketdotio&logoColor=white)

> **PrintPortal** is a Mini SaaS & comprehensive Printing Management System. Designed for educational institutions, corporate offices, and varied industries, it streamlines print requests, approval workflows, and fulfillment processes in a centralized, real-time, and identity-secure platform.

---

## 📖 Documentation

Detailed documentation for developers and contributors is located in the `docs` directory.

### [👉 Go to Full Documentation](./docs/README.md)

The documentation suite includes:
- **[Client Guide](./docs/client/README.md)**: Frontend architecture, components, and routing.
- **[Server Guide](./docs/server/README.md)**: API reference, database schema, and socket events.
- **[Component Library](./docs/client/components/README.md)**: Reusable UI elements.

---

## 🌟 Key Features

### 👨‍🏫 For Employee
- **Easy Requests**: Upload files and specify print details (copies, double-sided, etc.) in seconds.
- **Real-time Status**: Get instant notifications when your request is Approved, Printed, or Rejected.
- **History**: View past requests and track current job progress.

### 👮‍♂️ For Admins
- **Approval Queue**: Review incoming requests and Approve/Reject with a single click.
- **Monitoring**: Oversee the entire school's printing activity from a central dashboard.
- **Analytics**: View breakdown charts of print volume and status distribution.

### 🖨️ For Printing Dept
- **Job Queue**: A dedicated workspace showing only Approved jobs ready for printing.
- **One-Click Actions**: Download files directly and update job status (`In Progress` → `Completed`).
- **Workflow Management**: Keep the print room organized and efficient.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/sh1vam-03/printportal.git
cd printportal
```

#### 2. Backend Setup
```bash
cd server
npm install

# Create a .env file
echo "PORT=5000" >> .env
echo "MONGO_URI=mongodb://localhost:27017/printportal" >> .env
echo "JWT_SECRET=your_super_secret_key" >> .env

# Start Server
npm run dev
```

#### 3. Frontend Setup
```bash
cd client
npm install

# Start React Dev Server
npm run dev
```

Visit `http://localhost:5173` to view the application!

---

## 🏗️ Project Structure

The project is organized as a monorepo with separate client and server directories.

```text
printportal/
├── client/              # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/  # Reusable UI & Layouts
│   │   ├── pages/       # Role-based Dashboards
│   │   └── services/    # API & Socket Logic
│   └── public/
├── server/              # Node.js Backend (Express)
│   ├── src/
│   │   ├── controllers/ # Business Logic
│   │   ├── models/      # Database Schemas
│   │   └── routes/      # API Endpoints
│   └── uploads/         # Storage for print files
└── docs/                # 📚 Comprehensive Documentation
```

---

## 📜 License

This project is licensed under the MIT License.
