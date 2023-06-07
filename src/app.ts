import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routers";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import ormconfig from "./ormconfig";

dotenv.config();

// establish database connection
ormconfig
  .initialize()
  .then(() => {
    console.log("Database connected successfully");

    const app = express();

    app.use(express.json());

    app.use(cors());
    app.use(helmet());
    app.use(cookieParser());

    app.use(express.json());

    routes(app);

    app.listen(process.env.SITE_PORT, () => {
      console.log(
        `Application listening at ${process.env.SITE_PATH}:${process.env.SITE_PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("Database error:", err);
  });
