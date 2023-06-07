import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
// @ts-ignore
import ffprobePath from "@ffprobe-installer/ffprobe";
import { VIDEO_UPLOAD_DIRECTORY_PATH } from "../../shared/constants/video";

dotenv.config();

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

export default async function generateVideoThumbnailService(
  fileName: string,
  fileFormat: string,
  thumbnailFileFormat: string,
  thumbnailFilePostfix: string,
  thumbnailSize: string,
  thumbnailTimestamps: number[] | string[],
  videoThumbnailDirectoryPath: string
) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`./${VIDEO_UPLOAD_DIRECTORY_PATH}/${fileName}.${fileFormat}`)
      .thumbnail({
        timestamps: thumbnailTimestamps,
        filename: `${fileName}${thumbnailFilePostfix}${
          thumbnailTimestamps.length <= 1 ? "_1" : ""
        }.${thumbnailFileFormat}`,
        folder: `./${videoThumbnailDirectoryPath}/`,
        size: thumbnailSize,
      })
      .on("end", async (err) => {
        if (err) {
          console.log("thumbnail error: ", err);
        }

        console.log("thumb generated");
        return resolve();
      });
  });
}
