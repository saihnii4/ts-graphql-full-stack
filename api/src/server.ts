import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import homeRoute from "./routes/homeRoute";
import { ApolloServer } from "@apollo/server";
import gql from "graphql-tag";
import { expressMiddleware } from "@as-integrations/express5";
import http from "http";
import { config } from "./config";

const app = express();

const httpServer = http.createServer(app);

const typeDefs = gql`
  type Query {
    hello: String
    foo: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "hello world",
    foo: () => "Testing",
  },
};

const server = new ApolloServer<{}>({
  typeDefs,
  resolvers,
});

const main = async () => {
  await server.start();

  app.use(express.json());
  app.use(expressMiddleware(server, { context: async () => ({}) }));
  app.use("/", homeRoute);
  app.use(errorHandler);

  await new Promise<void>((res) => {
    httpServer.listen({ port: config.PORT, path: "/gql-dash" }, res);
  });

  console.log("Server Started");
};

main().then(() => {});
