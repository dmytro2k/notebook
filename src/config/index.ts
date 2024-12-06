import dotenv from 'dotenv';

dotenv.config();

type ENV = {
  DATABASE_URL: string | undefined;
  DATABASE_HOST: string | undefined;
  DATABASE_PORT: number | undefined;
  DATABASE_USER: string | undefined;
  DATABASE_PASSWORD: string | undefined;
  DATABASE_NAME: string | undefined;
  SERVER_HOSTNAME: string | undefined;
  SERVER_PORT: number | undefined;
  JWT_SECRET: string | undefined;
  JWT_LIFETIME: string | undefined;
};

type Config = {
  DATABASE_URL: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  SERVER_HOSTNAME: string;
  SERVER_PORT: number;
  JWT_SECRET: string;
  JWT_LIFETIME: string;
};

const getConfig = (): ENV => {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
    DATABASE_PORT: process.env.DATABASE_PORT ? Number(process.env.SERVER_PORT) : undefined,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    SERVER_HOSTNAME: process.env.SERVER_HOSTNAME || 'localhost',
    SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_LIFETIME: process.env.JWT_LIFETIME,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
