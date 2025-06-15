"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://media-react-deploy-borf.vercel.app",
// ];
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
const uploadDir = path_1.default.join(__dirname, "..", "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
app.get("/", (req, res) => {
    res.send("Backend is working!");
});
app.use("/uploads", express_1.default.static(uploadDir));
app.use("/api", mediaRoutes_1.default);
app.use("/media", mediaRoutes_1.default);
app.use("/auth", authRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
