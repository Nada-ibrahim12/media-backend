"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.get("/logout", authController_1.logout);
router.get("/user", verifyToken_1.verifyToken, authController_1.getUserDetails);
exports.default = router;
