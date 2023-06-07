import busboy from "busboy";
import { Request, Response } from "express";
import { GENERIC_ERROR_MESSAGE } from "../shared/constants/message";
import {
  VIDEO_CATEGORIES,
  ALLOWED_TYPES,
  AUDIO_BITRATE,
  AUDIO_CHANNELS,
  AUDIO_CODEC,
  OUTPUT_FILE_POSTFIX,
  OUTPUT_FILE_TYPE,
  THUMBNAIL_FILE_FORMAT,
  THUMBNAIL_FILE_POSTFIX,
  THUMBNAIL_SIZE,
  THUMBNAIL_TIMESTAMPS,
  VIDEO_BITRATE,
  VIDEO_CODEC,
  VIDEO_OUTPUT_DIRECTORY_PATH,
  VIDEO_SIZE,
  VIDEO_THUMBNAIL_DIRECTORY_PATH,
  VIDEO_UPLOAD_DIRECTORY_PATH,
  VIDEO_LIST_DEFAULT_TAKE_PER_PAGE,
} from "../shared/constants/video";
import generateRandomString from "../services/shared/generate-random-string.service";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
// @ts-ignore
import ffprobePath from "@ffprobe-installer/ffprobe";
import dotenv from "dotenv";
import fs from "fs";
import generateVideoThumbnailService from "../services/video/generate-video-thumbnail.service";
import ormconfig from "../ormconfig";
import { Video } from "../entities/video.entity";
import path from "path";
import convertVideoService from "../services/video/convert-video.service";
import { ResponseDataInterface } from "../interfaces/response-data.interface";
import responseMessage from "../services/shared/response-message.service";
import {
  GetVideoListConResDataInterface,
  GetVideoThumbnailConReqQueryInterface,
} from "../interfaces/video.interface";
import {
  SaveVideoConResDataInterface,
  SaveVideoDataInterface,
  GetVideoListConFetchParamsInterface,
} from "../interfaces/video.interface";
import { FindOperator, ILike } from "typeorm";

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

dotenv.config();

// GET VIDEO DETAILS
export async function getVideoController(req: Request, res: Response) {
  const name: string = String(req.params.name);

  if (!name) {
    return res.status(400).json({
      success: false,
      messages: responseMessage("Video name required"),
    });
  }

  const whereData: { name: string } = { name };

  const foundVideoData = await ormconfig.getRepository(Video).findOne({
    where: whereData,
  });

  if (!foundVideoData) {
    return res.status(400).json({
      success: false,
      messages: responseMessage("Video not found"),
    });
  }

  return res.json({
    success: true,
    messages: responseMessage("Video details found successfully"),
    data: foundVideoData,
  });
}

// GET VIDEO LIST
export async function getVideoListController(
  req: Request<GetVideoListConFetchParamsInterface>,
  res: Response<ResponseDataInterface<GetVideoListConResDataInterface>>
) {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const take = req.query.take
    ? Number(req.query.take)
    : VIDEO_LIST_DEFAULT_TAKE_PER_PAGE;
  const category = req.query.category ? String(req.query.category) : "";
  const title = req.query.title ? String(req.query.title) : "";
  const orderBy = VIDEO_CATEGORIES.hasOwnProperty(String(req.query.orderBy))
    ? String(req.query.orderBy)
    : "";
  const order = orderBy && req.query.order === "ASC" ? "ASC" : "DESC";

  // return used fetch parameters in with response
  const fetchParams: GetVideoListConFetchParamsInterface = {
    skip,
    take,
    category,
    title,
    orderBy,
    order,
  };

  const where: { category?: string; title?: FindOperator<string> } = {};
  if (category) {
    where.category = category;
  }

  if (title) {
    where.title = ILike(`%${title}%`);
  }

  const findVideoListData: {
    where: { category?: string; title?: FindOperator<string> };
    order: { id: "ASC" | "DESC" };
    skip: number;
    take: number;
  } = {
    where: {},
    order: {
      id: "DESC",
    },
    skip,
    take,
  };

  if (Object.keys(where).length) {
    findVideoListData.where = where;
  }

  const foundVideoListData = await ormconfig
    .getRepository(Video)
    .find(findVideoListData);

  if (!foundVideoListData) {
    return res.status(400).json({
      success: false,
      messages: responseMessage("Video list not found"),
    });
  }

  const total = await ormconfig.getRepository(Video).count();

  return res.json({
    success: true,
    messages: responseMessage("Video list found successfully"),
    data: { list: foundVideoListData, total, fetchParams },
  });
}

// SAVE VIDEO
export async function postVideoController(
  req: Request,
  res: Response<ResponseDataInterface<SaveVideoConResDataInterface>>
) {
  const bb = busboy({ headers: req.headers });
  let responseData: ResponseDataInterface<SaveVideoConResDataInterface> = {
    success: true,
    messages: [],
  };

  let fileUploadSuccess: boolean = false;

  const saveVideoData: SaveVideoDataInterface = {
    name: "",
    format: "",
    duration: 0,
    frameRate: 0,
    width: 0,
    height: 0,
    processStatus: 0,
    title: "",
    category: "",
    about: "",
  };

  let uploadVideoPath: string = "";

  bb.on("field", async (fieldName: string, value: string) => {
    switch (fieldName) {
      case "title":
        if (!value) {
          responseData = {
            success: false,
            messages: [
              ...responseData.messages,
              { msg: "title is required", path: "title" },
            ],
          };
        } else {
          saveVideoData.title = String(value);
        }
        break;
      case "category":
        if (!value) {
          responseData = {
            success: false,
            messages: [
              ...responseData.messages,
              { msg: "category is required", path: "category" },
            ],
          };
        } else if (!VIDEO_CATEGORIES.hasOwnProperty(value)) {
          responseData = {
            success: false,
            messages: [
              ...responseData.messages,
              { msg: "invalid category", path: "category" },
            ],
          };
        } else {
          saveVideoData.category = String(value);
        }
        break;
      case "about":
        saveVideoData.about = String(value);
    }
  })
    .on("file", async (_, file, info: any) => {
      if (
        info.mimeType &&
        Object.values(ALLOWED_TYPES).includes(info.mimeType)
      ) {
        saveVideoData.name = `${generateRandomString(8)}_${Date.now()}`;

        saveVideoData.format =
          Object.keys(ALLOWED_TYPES).find(
            (key: string) =>
              ALLOWED_TYPES[key as keyof typeof ALLOWED_TYPES] === info.mimeType
          ) || "";

        uploadVideoPath = `./${VIDEO_UPLOAD_DIRECTORY_PATH || ""}/${
          saveVideoData.name
        }.${saveVideoData.format}`;

        const stream = fs.createWriteStream(uploadVideoPath);

        file.pipe(stream);

        fileUploadSuccess = true;
      } else {
        file.resume();

        fileUploadSuccess = false;
      }
    })
    .on("close", async function () {
      if (!fileUploadSuccess) {
        responseData = {
          success: false,
          messages: [
            ...responseData.messages,
            { msg: "Invalid file format", path: "file" },
          ],
        };
      }

      if (!responseData.success) {
        if (fileUploadSuccess) {
          fs.unlinkSync(`./${uploadVideoPath}`);
          fileUploadSuccess = false;
        }

        return res.status(400).json(responseData);
      }

      // on upload and validation success
      responseData = {
        success: true,
        messages: [{ msg: `Uploaded successfully! Processing video...` }],
      };

      // get metadata
      ffmpeg.ffprobe(uploadVideoPath, async function (err, metadata) {
        if (err) {
          console.error(err);

          return res.status(500).json({
            success: false,
            messages: responseMessage(GENERIC_ERROR_MESSAGE),
          });
        } else {
          let fpsFormatArray = [];
          let fps = 0;
          if (metadata.streams[0].avg_frame_rate) {
            fpsFormatArray = metadata.streams[0].avg_frame_rate?.split("/");
            fps =
              fpsFormatArray[0] && fpsFormatArray[1]
                ? Number(fpsFormatArray[0]) / Number(fpsFormatArray[1])
                : 0;
          }

          saveVideoData.width = Math.round(Number(metadata.streams[0].width));
          saveVideoData.height = Math.round(Number(metadata.streams[0].height));
          saveVideoData.duration = Number(metadata.format.duration);
          saveVideoData.frameRate = Number(fps);

          saveVideoData.processStatus = 0;

          console.log("saveVideoData: ", saveVideoData);

          // save video data to database
          const savedVideoData = await ormconfig
            .getRepository(Video)
            .save(saveVideoData);

          if (!savedVideoData.id) {
            return res.status(500).json({
              success: false,
              messages: responseMessage(GENERIC_ERROR_MESSAGE),
            });
          }

          // generate thumbnail
          const generatedVideoThumbnail = await generateVideoThumbnailService(
            savedVideoData.name,
            savedVideoData.format,
            THUMBNAIL_FILE_FORMAT,
            THUMBNAIL_FILE_POSTFIX,
            THUMBNAIL_SIZE,
            THUMBNAIL_TIMESTAMPS,
            VIDEO_THUMBNAIL_DIRECTORY_PATH
          ).then(() => {
            console.log("thumbnails generated");
          });

          // convert video
          const convertedVideoService = convertVideoService(
            savedVideoData.id,
            savedVideoData.name,
            savedVideoData.format,
            AUDIO_BITRATE,
            AUDIO_CHANNELS,
            AUDIO_CODEC,
            OUTPUT_FILE_POSTFIX,
            OUTPUT_FILE_TYPE,
            VIDEO_BITRATE,
            VIDEO_CODEC,
            VIDEO_OUTPUT_DIRECTORY_PATH,
            VIDEO_SIZE
          );

          responseData.data = savedVideoData;

          console.log("responseData: ", responseData);

          return res.json(responseData);
        }
      });
    });

  req.pipe(bb);
}

// GET VIDEO THUMBNAIL
export async function getVideoThumbnailController(
  req: Request<GetVideoThumbnailConReqQueryInterface>,
  res: Response
) {
  const videoName: string = String(req.query.name) || "";
  const thumbnailNumberString: string = String(req.query.thumbNumber) || "";
  if (!videoName || !thumbnailNumberString) {
    return res.status(400).json({
      success: false,
      messages: responseMessage("Invalid thumbnail name/number"),
    });
  }

  const foundVideoData = await ormconfig
    .getRepository(Video)
    .findOneBy({ name: videoName });

  if (!foundVideoData) {
    return res.status(400).json({
      success: false,
      messages: responseMessage("Unable to fetch video data"),
    });
  }

  const filePath = path.join(
    __dirname,
    "../..",
    VIDEO_THUMBNAIL_DIRECTORY_PATH,
    `${videoName}${THUMBNAIL_FILE_POSTFIX}_${thumbnailNumberString}.${THUMBNAIL_FILE_FORMAT}`
  );

  const options = {};

  res.sendFile(filePath, options, function (err: any) {
    if (err) {
      console.log(err);

      return res.status(400).json({
        success: false,
        messages: responseMessage("Unable to fetch video thumbnail"),
      });
    } else {
      // console.log("Sent:", filePath);
    }
  });
}

// GET VIDEO STREAM
export async function getVideoStreamController(req: Request, res: Response) {
  const videoName: string = String(req.query.v);

  if (!videoName) {
    return res.status(400).json({
      success: false,
      messages: responseMessage("Video name required"),
    });
  }

  let videoPath = "";

  videoPath = `${VIDEO_OUTPUT_DIRECTORY_PATH}/${videoName}${OUTPUT_FILE_POSTFIX}.${OUTPUT_FILE_TYPE}`;

  const videoLocalPath = path.join(__dirname, "../..", videoPath);

  const options: any = {};

  let start: any;
  let end: any;

  const range = req.headers.range;
  if (range) {
    const bytesPrefix = "bytes=";
    if (range.startsWith(bytesPrefix)) {
      const bytesRange = range.substring(bytesPrefix.length);
      const parts = bytesRange.split("-");
      if (parts.length === 2) {
        const rangeStart = parts[0] && parts[0].trim();
        if (rangeStart && rangeStart.length > 0) {
          options.start = start = parseInt(rangeStart);
        }
        const rangeEnd = parts[1] && parts[1].trim();
        if (rangeEnd && rangeEnd.length > 0) {
          options.end = end = parseInt(rangeEnd);
        }
      }
    }
  }

  res.setHeader("content-type", "video/mp4");

  fs.stat(videoLocalPath, (err, stat) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        messages: responseMessage("Failed to get file"),
      });
    }

    let contentLength = stat.size;

    if (req.method === "HEAD") {
      res.statusCode = 200;
      res.setHeader("accept-ranges", "bytes");
      res.setHeader("content-length", contentLength);
      res.end();
    } else {
      let retrievedLength;
      if (start !== undefined && end !== undefined) {
        retrievedLength = end + 1 - start;
      } else if (start !== undefined) {
        retrievedLength = contentLength - start;
      } else if (end !== undefined) {
        retrievedLength = end + 1;
      } else {
        retrievedLength = contentLength;
      }

      res.statusCode = start !== undefined || end !== undefined ? 206 : 200;

      res.setHeader("content-length", retrievedLength);

      if (range !== undefined) {
        res.setHeader(
          "content-range",
          `bytes ${start || 0}-${end || contentLength - 1}/${contentLength}`
        );
        res.setHeader("accept-ranges", "bytes");
      }

      const fileStream = fs.createReadStream(videoLocalPath, options);
      fileStream.on("error", (error) => {
        console.log(`Error reading file ${videoLocalPath}.`);
        console.log(error);
        res.sendStatus(500);
      });

      fileStream.pipe(res);
    }
  });
}
