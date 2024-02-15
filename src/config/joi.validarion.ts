import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required(),
  APP_KEY: Joi.string().required(),
  WHITE_LIST_DOMAINS: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  CRYPTO_SECRET_KEY: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.number().required(),
});
