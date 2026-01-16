# Backend Documentation ⚙️

![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Headless-47A248?logo=mongodb&logoColor=white)

The backend is a robust REST API built with **Express.js**, serving as the central nervous system for **PrintPortal**. It handles data persistence, authentication, and real-time event broadcasting.

---

## 📂 Project Structure

```text
server/src/
├── config/              # 🔌 Database & Socket configuration
├── controllers/         # 🧠 Business Logic (Request handlers)
├── middlewares/         # 🛡️ Access Control & Validation
├── models/              # 🗄️ MongoDB Mongoose Schemas
├── routes/              # 🚦 API Endpoint Definitions
├── utils/               # 🛠️ Helper functions (JWT, Error Handling)
├── app.js               # ⚡ Express App Setup
└── server.js            # 🚀 Entry Point
```

## 🏗️ Core Architectures

| Module | Description | Documentation |
|--------|-------------|---------------|
| **API** | RESTful endpoint definitions. | [View Docs](./api-overview.md) |
| **Auth** | JWT-based stateless authentication. | [View Docs](./auth.md) |
| **Logic** | Print request state machine. | [View Docs](./print-request.md) |
| **Real-time** | Socket.io event system. | [View Docs](./notification.md) |