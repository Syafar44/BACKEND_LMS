import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";


export const USER_MODEL_NAME = "User";

export interface User {
    fullName: string;
    email: string;
    access: string;
    department: string;
    password: string;
    role: string;
    createdAt?: Date;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    access: {
        type: Schema.Types.String,
        required: true 
    },
    department: {
        type: Schema.Types.String,
        required: true 
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        default: 'user'
    },
},
{
    timestamps: true
});

UserSchema.pre('save', async function(next) {
    const user = this
    user.password = encrypt(user.password)
    next()
})

UserSchema.methods.toJSON = function() {
    const user = this.toObject()
    delete user.password
    return user
}

const UserModel = mongoose.model(USER_MODEL_NAME, UserSchema);

export default UserModel;