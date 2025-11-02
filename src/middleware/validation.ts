import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { IUserCreate, LoginCredentials } from '../types';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<IUserCreate>({
    username: Joi.string()
      .min(3)
      .message('Username debe de contener al menos 3 caracteres.')
      .max(50)
      .message('Username debe de contener al máximo 50 caracteres.')
      .required(),
    password: Joi.string()
      .min(6)
      .message('Username debe de contener al menos 6 caracteres.')
      .required(),
    email: Joi.string().email().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: error?.details[0]?.message
    });

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<LoginCredentials>({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: error?.details[0]?.message
    });

  next();
};

export const validateGeoPoint = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    type: Joi.string().valid('accidente', 'congestión', 'obstrucción', 'otro').required(),
    description: Joi.string().max(500).optional(),
    userid: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: error?.details[0]?.message
    });

  next();
};

export const validateProximityFilter = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    type: Joi.string().valid('accidente', 'congestión', 'obstrucción', 'otro').optional(),
    lat: Joi.number().min(-90).max(90).optional(),
    long: Joi.number().min(-180).max(180).optional(),
    radius: Joi.number().min(0.1).max(100).optional(),
  });

  const { error } = schema.validate(req.query);
  if (error)
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: error?.details[0]?.message
    });

  next();
};