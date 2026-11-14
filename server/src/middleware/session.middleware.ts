import { randomUUID } from "crypto";
import Session from "../models/Session.js";
import { Request, Response, NextFunction } from "express";

export const manageSession = async (
  req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let sessionId = req.cookies?.sessionId;

    let session = sessionId
      ? await Session.findOne({
          sessionId,
          expiresAt: { $gt: new Date() }
        })
      : null;

    if (!session) {
      sessionId = randomUUID();

      session = await Session.create({
        sessionId,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      });

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
      });
    }

    req.sessionId = session.sessionId;

    next();
  } catch (error) {
    next(error);
  }
};