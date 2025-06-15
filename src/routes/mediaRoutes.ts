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
  getLikesOfMedia,
} from "../controllers/mediaController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/upload", verifyToken, upload.single("file"), uploadMedia);
router.get("/", listMedia);
router.get("/search", searchMedia);
router.post("/:id/like",verifyToken, likeMedia);
router.post("/:id/unlike", verifyToken, unlikeMedia);
router.put("/:id", verifyToken, updateMedia);
router.delete("/:id", verifyToken, deleteMedia);
router.get("/:id/likes", verifyToken, getLikesOfMedia);

export default router;
