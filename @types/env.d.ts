declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    SERVER_HOSTNAME: string;
    SERVER_PORT: string;
    JWT_SECRET: string;
    JWT_LIFETIME: string;
  }
}
