import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { User } from "./models/User";
import { Post } from "./models/Post";
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

// import expressjwt from "express-jwt";
// import jwt from "jsonwebtoken";


const startServer = async() => {
    const app = express();

    const getUser = async token => {
        if (token) {
            try {
                return jwt.verify(token, process.env.SECRET);
            } catch (err) {
                throw new AuthenticationError(
                    "Your session has ended. Please sign in again."
                );

            }
        }
    };
    const schema = makeExecutableSchema({ typeDefs, resolvers });



    const server = new ApolloServer({
        schema,
        introspection: true,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context: async({ req }) => {
            const tokens = req.headers["token"];
            // const token = req.headers.token;
            console.log(tokens);
            console.log("=============");




            return { User, Post, currentUser: await getUser(tokens) };
        }

    });







    await server.start();

    server.applyMiddleware({ app });
    const uri = "mongodb+srv://mohamednabil:M963.8520@impala.1h1qg.mongodb.net/test66?retryWrites=true&w=majority";
    // const uri = "mongodb://localhost:27017/test66";
    await mongoose.connect(uri, {
        useNewUrlParser: true, useUnifiedTopology: true, 
    });

    app.listen({ port: 4001 }, () =>
        console.log(`🚀 Server ready at http://localhost:4001${server.graphqlPath}`)
    );
};

startServer();