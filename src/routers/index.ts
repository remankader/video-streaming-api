import { Express } from "express";
import { errorController } from "../controllers/error.controller";
import videoRouter from "./video.router";

function routes(app: Express) {
  app.use("/video", videoRouter);

  app.use(errorController);
}

export default routes;
