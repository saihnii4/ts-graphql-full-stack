import dotenv from "dotenv";

dotenv.config();

export interface Config {
  PORT?: number;
  DB_HOST: string;
}

export const config: Config = {
  PORT: Number(process.env.PORT) || 3030,
  DB_HOST: String(process.env.DB_HOST),
};
