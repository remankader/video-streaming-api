import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
// @ts-ignore
import ffprobePath from "@ffprobe-installer/ffprobe";
import ormconfig from "../../ormconfig";
import { Video } from "../../entities/video.entity";
import {
  VIDEO_FPS,
  VIDEO_UPLOAD_DIRECTORY_PATH,
} from "../../shared/constants/video";

dotenv.config();

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

export default async function convertVideoService(
  videoId: number,
  fileName: string,
  fileFormat: string,
  audioBitrate: string,
  audioChannels: number,
  audioCodec: string,
  outputFilePostfix: string,
  outputFileType: string,
  videoBitrate: string,
  videoCodec: string,
  videoOutputDirectoryPath: string,
  videoSize: string
) {
  let totalTime: number = 0;
  let processStatus: number = 0;
  const tempVideoPath = `./${VIDEO_UPLOAD_DIRECTORY_PATH}/${fileName}.${fileFormat}`;

  ffmpeg(tempVideoPath)
    .videoBitrate(videoBitrate)
    .videoCodec(videoCodec)
    .size(videoSize)
    .fps(VIDEO_FPS)
    .audioBitrate(audioBitrate)
    .audioChannels(audioChannels)
    .audioCodec(audioCodec)
    .output(
      `./${videoOutputDirectoryPath}/${fileName}${outputFilePostfix}.${outputFileType}`
    )
    .on("start", function (commandLine: any) {
      // console.log("Spawned Ffmpeg with command: " + commandLine);
    })
    .on("error", function (err: any, stdout: any, stderr: any) {
      console.log("An error occurred: " + err.message, err, stderr);
    })
    .on("codecData", (data) => {
      totalTime = parseInt(data.duration.replace(/:/g, ""));
    })
    .on("progress", async function (progress: any) {
      const time = parseInt(progress.timemark.replace(/:/g, ""));
      const percent: number = (time / totalTime) * 100;

      console.log(`Processing: ${percent}%`);

      if (percent >= processStatus + 5) {
        processStatus = Math.floor(percent);
        const updatedVideoData = await ormconfig
          .getRepository(Video)
          .update({ id: videoId }, { processStatus });

        if (!updatedVideoData) {
          console.log("process status update failed");
        }
      }
    })
    .on("end", async function (err: any, stdout: any, stderr: any) {
      const updatedVideoData = await ormconfig
        .getRepository(Video)
        .update({ id: videoId }, { processStatus: 100 });

      if (!updatedVideoData) {
        console.log("process status update failed");
      }

      console.log("Finished processing");
    })
    .run();
}
