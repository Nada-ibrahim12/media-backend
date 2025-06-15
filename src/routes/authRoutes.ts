import express from "express";
import { register, login, logout, getUserDetails } from "../controllers/authController";
 import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user", verifyToken, getUserDetails);

export default router;
