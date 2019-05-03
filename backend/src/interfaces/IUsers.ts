import { Document } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
    username: String;
    email: String;
    image: String;
    bio: String;
    salt: crypto.BinaryLike;
    hash: String;
}
