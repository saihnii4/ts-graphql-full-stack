import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import homeRoute from "./routes/homeRoute";
import { ApolloServer } from "@apollo/server";
import { config } from "./config";
import db from "./db";
import jwt from "jsonwebtoken";
import resolvers from "./resolvers";
import { typeDefs } from "./schema";
import models from "./models";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import helmet from "helmet";

const app = express();

db.connect(config.DB_HOST);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const getUser = (token: string) => {
  if (!token) return;

  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    throw new Error("session invalid");
  }
};

const main = async () => {
  await server.start();
  app.use(express.json());
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        if (!token) throw new Error("no authorization token");
        const user = getUser(token);
        console.error(user);
        return { models, user };
      },
    }),
  );
  app.use(helmet());
  app.use(cors());
  app.use("/", homeRoute);
  app.use(errorHandler);

  app.listen(3030, () => console.log("server started"));
};

main().then(() => {});
