import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import homeRoute from "./routes/homeRoute";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { config } from "./config";
import db from "./db";
import resolvers from "./resolvers";
import { typeDefs } from "./schema";
import models from "./models";
import { startStandaloneServer } from "@apollo/server/standalone";

const app = express();

db.connect(config.DB_HOST);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const main = async () => {
  await startStandaloneServer(server, {
    context: async () => ({ models }),
    listen: { port: config.PORT, path: "/graphql" },
  });

  app.use(express.json());
  app.use(expressMiddleware(server, { context: async () => ({ models }) }));
  app.use("/", homeRoute);
  app.use(errorHandler);

  console.log("Server Started");
};

main().then(() => {});
