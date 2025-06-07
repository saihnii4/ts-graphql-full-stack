import dotenv from "dotenv";

dotenv.config();

export interface Config {
  PORT?: number;
  DB_HOST: string;
  JWT_SECRET: string;
}

export const config: Config = {
  PORT: Number(process.env.PORT) || 3030,
  DB_HOST: String(process.env.DB_HOST),
  JWT_SECRET: String(process.env.JWT_SECRET),
};
