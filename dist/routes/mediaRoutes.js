"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middleware/upload"));
const mediaController_1 = require("../controllers/mediaController");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.post("/upload", verifyToken_1.verifyToken, upload_1.default.single("file"), mediaController_1.uploadMedia);
router.get("/", mediaController_1.listMedia);
router.get("/search", mediaController_1.searchMedia);
router.post("/:id/like", verifyToken_1.verifyToken, mediaController_1.likeMedia);
router.post("/:id/unlike", verifyToken_1.verifyToken, mediaController_1.unlikeMedia);
router.put("/:id", verifyToken_1.verifyToken, mediaController_1.updateMedia);
router.delete("/:id", verifyToken_1.verifyToken, mediaController_1.deleteMedia);
router.get("/:id/likes", verifyToken_1.verifyToken, mediaController_1.getLikesOfMedia);
exports.default = router;
