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

const router = express.Router();

router.post("/upload", upload.single("file"), uploadMedia);
router.get("/", listMedia);
router.get("/search", searchMedia);
router.post("/:id/like", likeMedia);
router.post("/:id/unlike", unlikeMedia);
router.put("/:id", updateMedia);
router.delete("/:id", deleteMedia);

export default router;
