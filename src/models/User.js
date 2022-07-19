import mongoose from "mongoose";
import md5 from "md5";
import bcrypt from "bcrypt";



export const User = new mongoose.model("User", {

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "Post"
    },
    roles: {
        type: String,
        required: true,
        // default: "NewUserww",
    },
    permissions: {
        type: String,
        required: true,

    }
});
// export const ssss = new mongoose.model("User", {


// // Hash password so it can't be seen w/ access to database
// User.pre("save", function(next) {
//     if (!this.isModified("password")) {
//         return next();
//     }
//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) return next(err);

//         bcrypt.hash(this.password, salt, (err, hash) => {
//             if (err) return next(err);

//             this.password = hash;
//             next();
//         });
//     });
// });