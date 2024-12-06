declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_USER: string;
    MONGO_PASSWORD: string;
    MONGO_URL: string;
    MONGO_DATABASE: string;
    SERVER_HOSTNAME: string;
    SERVER_PORT: string;
    JWT_SECRET: string;
    JWT_LIFETIME: string;
  }
}
