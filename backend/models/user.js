import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: false,
    },
    followers: [{type:ObjectId, ref:"User"}],
    following: [{type:ObjectId, ref:"User"}],
    id: {
        type: String,
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;