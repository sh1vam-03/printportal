import express from "express";
import * as userController from "../controllers/user.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// protect all routes - only ADMIN can access
router.use(requireRole(["ADMIN"]));

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id/terminate", userController.terminateSession);

export default router;
