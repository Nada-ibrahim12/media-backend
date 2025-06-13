import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/verifyToken";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

export const uploadMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { title, type } = req.body;

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }
  if (!req.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const newMedia = await prisma.media.create({
    data: {
      title,
      type,
      fileUrl: (req.file as any).path,
      userId: req.userId,
    },
  });

  res.status(201).json(newMedia);
};


export const updateMedia = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { title, type } = req.body;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  const updated = await prisma.media.update({
    where: { id },
    data: {
      title: title ?? media.title,
      type: type === "image" || type === "video" ? type : media.type,
    },
  });

  res.json({ message: "Media updated", media: updated });
};

export const deleteMedia = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  await prisma.media.delete({ where: { id } });
  res.json({ message: "Media deleted successfully" });
};

export const searchMedia = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title } = req.query;

  if (!title || typeof title !== "string") {
    res.status(400).json({ message: "Missing or invalid search title" });
    return;
  }

  const filtered = await prisma.media.findMany({
    where: {
      title: {
        contains: title.toString(),
      },
    },
  });

  res.json(filtered);
};


export const listMedia = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const media = await prisma.media.findMany();
  res.json(media);
};

export const likeMedia = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  const updated = await prisma.media.update({
    where: { id },
    data: { likes: media.likes + 1 },
  });

  res.json({ message: "Liked", likes: updated.likes });
};

export const unlikeMedia = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  const updated = await prisma.media.update({
    where: { id },
    data: { likes: Math.max(media.likes - 1, 0) },
  });

  res.json({ message: "Unliked", likes: updated.likes });
};
