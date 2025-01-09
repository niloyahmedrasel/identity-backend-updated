import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi, { Schema } from 'joi';

// The validate function returns a RequestHandler, which is a valid type for Express middleware
const validate = (schema: Schema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details.map((detail) => detail.message),
      });
    }

    // If no validation error, call next() to pass control to the next middleware
    next();
  };
};

export default validate;
