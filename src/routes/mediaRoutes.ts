import express from "express";
import { Media } from "../models/mediaModel";
import upload from "../middleware/upload";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";


const router = express.Router();

let mediaItems: Media[] = []; 

router.post(
  "/upload",
  upload.single("file"),
  (req: Request, res: Response): void => {
    const { title, type } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

    const newMedia: Media = {
      id: uuidv4(),
      title,
      url: req.file.path,
      type,
      likes: 0,
    };

    mediaItems.push(newMedia);
    res.status(201).json(newMedia);
  }
);
  

router.get("/", (_req, res) => {
  res.json(mediaItems);
});

router.post("/:id/like", ((req, res) => {
  const { id } = req.params;

  const media = mediaItems.find((m) => m.id === id);
  if (!media) return res.status(404).json({ message: "Media not found" });

  media.likes += 1;
  res.json({ message: "Liked", likes: media.likes });
}) as express.RequestHandler);


router.post("/:id/unlike", (req: Request, res: Response): void => {
  const { id } = req.params;

  const media = mediaItems.find((m) => m.id === id);
  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  media.likes = Math.max(media.likes - 1, 0);
  res.json({ message: "Unliked", likes: media.likes });
});

export default router;
