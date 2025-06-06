import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import homeRoute from "./routes/homeRoute";
import { ApolloServer } from "@apollo/server";
import gql from "graphql-tag";
import { expressMiddleware } from "@as-integrations/express5";
import http from "http";
import { config } from "./config";
import db from "./db";
import models from "./models";

const app = express();
const httpServer = http.createServer(app);

db.connect(config.DB_HOST);

const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }
  type Query {
    hello: String
    notes: [Note!]!
  }
  type Mutation {
    newNote(content: String!): Note!
  }
`;

const resolvers = {
  Query: {
    hello: () => "hello world",
    notes: async () => {
      return await models.Note.find();
    },
    // note: (parent: any, args: any) => {
    //   console.log(parent);
    //   return notes.find((note) => note.id === args.id);
    // },
  },
  Mutation: {
    newNote: async (parent: any, args: any) => {
      return await models.Note.create({
        content: args.content,
        author: "Adam Scott",
      });
    },
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
