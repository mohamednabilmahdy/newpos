import {
    gql
} from "apollo-server-express";

export const typeDefs = gql `
  type Query {
    users: [User]
    # getCat: [Cat!]
    Cat(id: ID): Cat
    poste(name: String): [Cat]
    user(id: ID!): [User]
    getUserByID(id: ID!): User
    post(email: String): [Post]
    gets(id: ID!): [Post]
    getCurrentUser: User
    getPosts: [Post]
  
  }
  type Token {
    token: String!
  }

  type User {
    id: ID
    username: String!
    email: String!
    password: String!
    avatar: String
    joinDate: String
    favorites: [Post]
    roles: String!
    permissions: String!
  }

  type Post {
    title: String!
    imageUrl: String!
    categories: [String]!
    description: String!
    createdDate: String
    likes: Int
    createdBy: User!
    messages: [Message]
  }

  type Message {
    id: ID
    messageBody: String!
    messageDate: String
    messageUser: User!
  }

  enum Role {
    ADMIN
    REVIEWER
    NewUserww
  }

  type Cat {
    id: ID!
    name: String!
    age: Int!
    address: String
  }
  type Mutation {
    createCat(name: String!, age: Int!, address: String): Cat!

    addPost(
      title: String!
      imageUrl: String!
      categories: [String]!
      description: String!
      creatorId: ID!
    ): Post!
    signupUser(
      username: String!
      email: String!
      password: String!
      roles: String!
      permissions: String!
      avatar: String
    ): User!



    signinUser(username: String!, password: String!): Token

  }
`;