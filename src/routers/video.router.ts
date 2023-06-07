import express from "express";
import {
  getVideoController,
  getVideoListController,
  getVideoStreamController,
  getVideoThumbnailController,
  postVideoController,
} from "../controllers/video.controller";

const videoRouter = express.Router();

videoRouter.get("/", getVideoListController);
videoRouter.get("/thumbnail", getVideoThumbnailController);
videoRouter.get("/stream", getVideoStreamController);
videoRouter.get("/:name", getVideoController);
videoRouter.post("/", postVideoController);

export default videoRouter;
