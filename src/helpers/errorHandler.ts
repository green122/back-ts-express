import * as httpStatus from 'http-status';
import {TokenExpiredError} from "jsonwebtoken";

// handle not found errors
export const notFound = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND);
  res.json({
    success: false,
    message: 'Requested Resource Not Found'
  });
  res.end();
};

export const unAuthorized = (err, req, res, next) => {
  if (err instanceof TokenExpiredError || err.status === httpStatus.UNAUTHORIZED) {
    res.status(httpStatus.UNAUTHORIZED);
    res.json({
      success: false,
      message: 'token expired'
    });
    res.end();
    return;
  }
  next(err);
}

// handle internal server errors
export const internalServerError = (err, req, res, next) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    extra: err.extra,
    errors: err
  });
  res.end();
};
