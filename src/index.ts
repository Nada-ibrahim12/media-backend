import express from "express";
import mediaRoutes from "./routes/mediaRoutes";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://media-react-deploy-borf.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));

app.use("/api", mediaRoutes);

app.use("/media", mediaRoutes);

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
