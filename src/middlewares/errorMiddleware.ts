import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

type AppError = Error & { status?: number };

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) {
		return next(err);
	}
	logger.error(err.message, { stack: err.stack });

	const status = err.status ?? 500;
	const message = process.env.NODE_ENV === "production"
		? "Something went wrong. Please try again later."
		: err.message;

	res.status(status).json({
		success: false,
		message
	});
};
