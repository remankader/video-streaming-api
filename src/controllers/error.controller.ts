import { Request, Response } from "express";
import responseMessage from "../services/shared/response-message.service";

export function errorController(req: Request, res: Response) {
  return res
    .status(404)
    .json({
      success: false,
      messages: responseMessage("Page not found"),
    });
}
