import { AppError } from '../utils/AppError';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .min(3)
      .max(50)
      .messages({
        'any.required': 'Username es requerido.',
        'string.min': 'Username debe de contener al menos 3 caracteres.',
        'string.max': 'Username debe de contener al máximo 50 caracteres.',
        'string.empty': 'Username no puede ser vacío.'
      }),
    password: Joi.string()
      .required()
      .min(6)
      .messages({
        'any.required': 'password es requerido.',
        'string.min': 'password debe de contener al menos 6 caracteres.',
        'string.empty': 'password no puede ser vacío.'
      }),
    email: Joi.string().email().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    throw new AppError('VALIDATION_ERROR', error?.details[0]?.message ?? '', 400);

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .messages({
        'any.required': 'username es requerido.',
        'string.empty': 'username no puede ser vacío.'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'password es requerido.',
        'string.empty': 'password no puede ser vacío.'
      }),
  });

  const { error } = schema.validate(req.body);
  if (error)
    throw new AppError('VALIDATION_ERROR', error?.details[0]?.message ?? '', 400);

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
    throw new AppError('VALIDATION_ERROR', error?.details[0]?.message ?? '', 400);

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
    throw new AppError('VALIDATION_ERROR', error?.details[0]?.message ?? '', 400);

  next();
};