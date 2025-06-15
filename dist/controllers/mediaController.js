"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikesOfMedia = exports.unlikeMedia = exports.likeMedia = exports.listMedia = exports.searchMedia = exports.deleteMedia = exports.updateMedia = exports.uploadMedia = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
console.log(Object.keys(prisma));
const uploadMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newMedia = yield prisma.media.create({
            data: {
                title,
                type,
                fileUrl: req.file.path,
                userId: req.userId,
            },
        });
        res.status(201).json(newMedia);
    }
    catch (error) {
        console.error("UploadMedia error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.uploadMedia = uploadMedia;
const updateMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, type } = req.body;
    const media = yield prisma.media.findUnique({ where: { id } });
    if (!media) {
        res.status(404).json({ message: "Media not found" });
        return;
    }
    const updated = yield prisma.media.update({
        where: { id },
        data: {
            title: title !== null && title !== void 0 ? title : media.title,
            type: type === "image" || type === "video" ? type : media.type,
        },
    });
    res.json({ message: "Media updated", media: updated });
});
exports.updateMedia = updateMedia;
const deleteMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const media = yield prisma.media.findUnique({ where: { id } });
    if (!media) {
        res.status(404).json({ message: "Media not found" });
        return;
    }
    yield prisma.like.deleteMany({
        where: { mediaId: id }
    });
    yield prisma.media.delete({ where: { id } });
    res.json({ message: "Media deleted successfully" });
});
exports.deleteMedia = deleteMedia;
const searchMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.query;
    if (!title || typeof title !== "string") {
        res.status(400).json({ message: "Missing or invalid search title" });
        return;
    }
    const filtered = yield prisma.media.findMany({
        where: {
            title: {
                contains: title.toString(),
            },
        },
    });
    res.json(filtered);
});
exports.searchMedia = searchMedia;
const listMedia = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const media = yield prisma.media.findMany({
        include: {
            user: {
                select: { id: true, firstName: true, lastName: true },
            },
        },
    });
    res.json(media);
});
exports.listMedia = listMedia;
const likeMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!id) {
        res.status(400).json({ message: "Media ID is required" });
        return;
    }
    const media = yield prisma.media.findUnique({ where: { id } });
    if (!media) {
        res.status(404).json({ message: "Media not found" });
        return;
    }
    const existingLike = yield prisma.like.findUnique({
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
    yield prisma.like.create({
        data: {
            userId,
            mediaId: id,
        },
    });
    const updatedMedia = yield prisma.media.update({
        where: { id },
        data: {
            likesCount: {
                increment: 1,
            },
        },
    });
    res.json({ message: "Liked", likesCount: updatedMedia.likesCount });
});
exports.likeMedia = likeMedia;
const unlikeMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!id) {
        res.status(400).json({ message: "Media ID is required" });
        return;
    }
    const media = yield prisma.media.findUnique({ where: { id } });
    if (!media) {
        res.status(404).json({ message: "Media not found" });
        return;
    }
    const existingLike = yield prisma.like.findUnique({
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
    yield prisma.like.delete({
        where: {
            userId_mediaId: {
                userId,
                mediaId: id,
            },
        },
    });
    const updatedMedia = yield prisma.media.update({
        where: { id },
        data: {
            likesCount: {
                decrement: 1,
            },
        },
    });
    res.json({ message: "Unliked", likesCount: updatedMedia.likesCount });
});
exports.unlikeMedia = unlikeMedia;
const getLikesOfMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "Media ID is required" });
        return;
    }
    const media = yield prisma.media.findUnique({
        where: { id },
    });
    if (!media) {
        res.status(404).json({ message: "Media not found" });
        return;
    }
    const likes = yield prisma.like.findMany({
        where: { mediaId: id },
        select: {
            userId: true,
            mediaId: true,
        },
    });
    res.json(likes);
});
exports.getLikesOfMedia = getLikesOfMedia;
