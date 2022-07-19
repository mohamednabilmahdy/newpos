import { Cat } from "./models/Cat";
import { User } from "./models/User";
import { Post } from "./models/Post";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import _ from "lodash";
const createToken = (user, secret, expiresIn) => {
    const { username, email } = user;
    return jwt.sign({ username, email }, secret, { expiresIn });
};
export const resolvers = {
    Query: {
        getCurrentUser: async(_, args, { User, currentUser }) => {
            if (!currentUser) {
                return null;
            }
            const user = await User.findOne({
                username: currentUser.username
            }).populate({
                path: 'favorites',
                model: 'Post'
            });
            return user;
        },

        getPosts: async(_, args, { Post }) => {
            const posts = await Post.find({})
                .sort({ createdDate: "desc" })
                .populate({
                    path: "createdBy",
                    model: "User"
                });
            return posts;
        },
        post: async(_, args, context) => {
            // const createdByw = await Post.findOne({ id: args.id })
            const createdByw = await Post.find({ email: args.email })
                // console.log(createdByw);
            return createdByw;
        },

    },




    Mutation: {
        createCat: async(_, { name, age, address }) => {
            const kitty = new Cat({
                name,
                age,
                address,
            });
            await kitty.save();
            return kitty;
        },

        addPost: async(
            _, { title, imageUrl, categories, description, creatorId, email }, { Post }
        ) => {
            const newPost = await new Post({
                title,
                imageUrl,
                categories,
                description,
                createdBy: creatorId,
                email: email,
            }).save();
            return newPost;
        },
        signinUser: async(_, { username, password }, { User }) => {

            const user = await User.findOne({ username });
            if (!user) {
                throw new Error("User not found");
            }
            // const isValidPassword = await bcrypt.compare(password, user.password);
            if (password != user.password) {
                throw new Error("Invalid password");
            }
            return { token: createToken(user, process.env.SECRET, "1m") };
        },

        signupUser: async(
            _, { username, email, password, roles, permissions, avatar }, { User }
        ) => {
            const user = await User.findOne({
                username,
            });
            if (user) {
                throw new Error("User already exists");
            }

            User.pre('save', () => {
                this.avatar = `http://gravatar.com/avatar/${md5(this.username)}?d=identicon`;
            });
            const newUser = await new User({
                username,
                email,
                password,
                avatar,
                roles,
                permissions,
            }).save();
            // return newUser;
            return { token: createToken(newUser, process.env.SECRET, "1hr"), username: username };


        },
    },
};