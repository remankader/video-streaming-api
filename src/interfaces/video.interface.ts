// get video list controller
export interface GetVideoListConFetchParamsInterface {
  skip: number;
  take: number;
  category: string;
  title: string;
  orderBy: string;
  order: "ASC" | "DESC";
}

export interface GetVideoListConResDataInterface {
  list: {
    id: number;
    name: string;
    format: string;
    duration: number;
    frameRate: number;
    width: number;
    height: number;
    processStatus: number;
    title: string;
    category: string;
    about: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  total: number;
  fetchParams: GetVideoListConFetchParamsInterface;
}

// save video controller
export interface SaveVideoDataInterface {
  name: string;
  format: string;
  duration: number;
  frameRate: number;
  width: number;
  height: number;
  processStatus: number;
  title: string;
  category: string;
  about: string;
}

export interface SaveVideoConResDataInterface {
  id: number;
  name: string;
  format: string;
  duration: number;
  frameRate: number;
  width: number;
  height: number;
  processStatus: number;
  title: string;
  category: string;
  about: string;
  createdAt: Date;
  updatedAt: Date;
}

// get video thumbnail controller
export interface GetVideoThumbnailConReqQueryInterface {
  name: string;
  thumbNumber: string;
}
