import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }
    next();
  };
};

// Common validation schemas
export const schemas = {
  signup: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  createConversation: Joi.object({
    topic_id: Joi.string().uuid().required(),
    persona: Joi.string().valid('mentor', 'critic').required(),
  }),
};