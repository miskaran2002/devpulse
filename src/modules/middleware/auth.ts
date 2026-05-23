
import jwt from "jsonwebtoken";
import config from "../../config";
import type { NextFunction, Request, Response } from "express";


const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const token = req.headers.authorization;

    // no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      config.secret as string
    );

    // attach user
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }
};

export default auth;