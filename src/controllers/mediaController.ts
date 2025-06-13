import { Request, Response } from "express";
import { mediaItems, Media } from "../models/mediaModel";
import { v4 as uuidv4 } from "uuid";


export const uploadMedia = (req: Request, res: Response) => {
  const file = req.file;
  const title = req.body.title;
  const type = file?.mimetype.startsWith("video") ? "video" : "image";

  if (!file || !title) {
    return res.status(400).json({ message: "Title and file are required." });
  }

  const newMedia: Media = {
    id: uuidv4(),
    title,
    url: `/uploads/${file.filename}`,
    type,
    likes: 0,
  };


  mediaItems.push(newMedia);
  res.status(201).json(newMedia);
};

export const getAllMedia = (_req: Request, res: Response) => {
  res.json(mediaItems);
};

export const toggleLike = (req: Request, res: Response) => {
  const { id } = req.params;

  const media = mediaItems.find((item) => item.id === id);
  if (!media) {
    return res.status(404).json({ message: "Media not found." });
  }

  media.likes++;
  res.json({ message: "Liked!", likes: media.likes });
};

export const toggleUnlike = (req: Request, res: Response) => {
  const { id } = req.params;

  const media = mediaItems.find((item) => item.id === id);
  if (!media) {
    return res.status(404).json({ message: "Media not found." });
  }

  media.likes = Math.max(0, media.likes - 1);
  res.json({ message: "Unliked!", likes: media.likes });
};
