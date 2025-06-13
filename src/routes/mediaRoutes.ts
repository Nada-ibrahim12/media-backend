import express from "express";
import upload from "../middleware/upload";
import {
  uploadMedia,
  listMedia,
  likeMedia,
  unlikeMedia,
  updateMedia,
  deleteMedia,
  searchMedia,
} from "../controllers/mediaController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/upload", verifyToken, upload.single("file"), uploadMedia);
router.get("/", listMedia);
router.get("/search", searchMedia);
router.post("/:id/like", likeMedia);
router.post("/:id/unlike", unlikeMedia);
router.put("/:id", verifyToken, updateMedia);
router.delete("/:id", verifyToken, deleteMedia);

export default router;
