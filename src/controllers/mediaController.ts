import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/verifyToken";

const prisma = new PrismaClient();
console.log(Object.keys(prisma));

interface AuthRequest extends Request {
  userId?: string;
}

export const uploadMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
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
        fileUrl: req.file.path,
        userId: req.userId,
      },
    });

    res.status(201).json(newMedia);
  } catch (error) {
    console.error("UploadMedia error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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

  await prisma.like.deleteMany({
    where: { mediaId: id }
  });

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
  const media = await prisma.media.findMany({
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });
  res.json(media);
};

export const likeMedia = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!id) {
    res.status(400).json({ message: "Media ID is required" });
    return;
  }

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_mediaId: {
        userId,
        mediaId: id,
      },
    },
  });

  if (existingLike) {
    res.status(400).json({ message: "You have already liked this media" });
    return;
  }

  await prisma.like.create({
    data: {
      userId,
      mediaId: id,
    },
  });

  const updatedMedia = await prisma.media.update({
    where: { id },
    data: {
      likesCount: {
        increment: 1,
      },
    },
  });

  res.json({ message: "Liked", likesCount: updatedMedia.likesCount });
};

export const unlikeMedia = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!id) {
    res.status(400).json({ message: "Media ID is required" });
    return;
  }

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_mediaId: {
        userId,
        mediaId: id,
      },
    },
  });

  if (!existingLike) {
    res.status(400).json({ message: "You have not liked this media yet" });
    return;
  }

  await prisma.like.delete({
    where: {
      userId_mediaId: {
        userId,
        mediaId: id,
      },
    },
  });

  const updatedMedia = await prisma.media.update({
    where: { id },
    data: {
      likesCount: {
        decrement: 1,
      },
    },
  });

  res.json({ message: "Unliked", likesCount: updatedMedia.likesCount });
};

export const getLikesOfMedia = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "Media ID is required" });
    return;
  }

  const media = await prisma.media.findUnique({
    where: { id },
  });

  if (!media) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  const likes = await prisma.like.findMany({
    where: { mediaId: id },
    select: {
      userId: true,
      mediaId: true,
    },
  });

  res.json(likes);
};
