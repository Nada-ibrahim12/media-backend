import express from "express";
import mediaRoutes from "./routes/mediaRoutes";
import path from "path";
import fs from "fs";


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));

app.use("/api", mediaRoutes);

app.use("/media", mediaRoutes);


app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
