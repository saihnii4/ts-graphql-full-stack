import gql from "graphql-tag";

export const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }
  type Query {
    note(id: ID!): Note!
    notes: [Note!]!
  }
  type Mutation {
    newNote(content: String!): Note!
    deleteNote(id: ID!): Boolean!
    updateNote(id: ID!, content: String!): Note!
  }
`;
