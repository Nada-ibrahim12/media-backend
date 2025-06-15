import express from "express";
import mediaRoutes from "./routes/mediaRoutes";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://media-react-deploy-borf.vercel.app",
// ];

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.use("/uploads", express.static(uploadDir));

app.use("/api", mediaRoutes);

app.use("/media", mediaRoutes);

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
