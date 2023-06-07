// Video formats
export const ALLOWED_TYPES: object = {
  mp4: "video/mp4",
  mkv: "video/x-matroska",
  webm: "video/webm",
};

// Generating thumbnails
export const THUMBNAIL_TIMESTAMPS: number[] | string[] = [1];
export const THUMBNAIL_FILE_POSTFIX: string = "_thumb";
export const THUMBNAIL_FILE_FORMAT: string = "jpg";
export const THUMBNAIL_SIZE: string = "?x480";

// Video conversion
export const VIDEO_UPLOAD_DIRECTORY_PATH: string = "media/video/raw";
export const VIDEO_OUTPUT_DIRECTORY_PATH: string = "media/video/stream";
export const VIDEO_THUMBNAIL_DIRECTORY_PATH: string = "media/video/thumbnail";
export const VIDEO_BITRATE: string = "900k";
export const OUTPUT_FILE_TYPE: string = "mp4";
export const OUTPUT_FILE_POSTFIX: string = "_stream";
export const VIDEO_CODEC: string = "libx264";
export const VIDEO_SIZE: string = "?x720";
export const VIDEO_FPS: number = 30;
export const AUDIO_BITRATE: string = "120k";
export const AUDIO_CHANNELS: number = 2;
export const AUDIO_CODEC: string = "libmp3lame";

// Generating clip thumbnails
export const VIDEO_CLIP_THUMBNAIL_DIRECTORY_PATH: string =
  "media/video/clip-thumbnail";
export const VIDEO_CLIP_THUMBNAIL_POSTFIX: string = "_thumb";

// Generating clips
export const VIDEO_CLIP_STREAM_DIRECTORY_PATH: string =
  "media/video/clip-stream";
export const VIDEO_CLIP_POSTFIX: string = "_clip";
export const VIDEO_CLIP_STREAM_POSTFIX: string = "_clip_stream";

// video status
export const VIDEO_STATUS_ACTIVE: number = 1;
export const VIDEO_STATUS_INACTIVE: number = 2;

// video content categories
export const VIDEO_CATEGORIES = {
  music: "Music",
  game: "Game",
};

export const VIDEO_LIST_DEFAULT_TAKE_PER_PAGE: number = 20;
