import mongoose from 'mongoose';
const {ObjectId} = mongoose.Schema.Types

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        default: 'no photo',
    },
    username: {
        type: String,
        required: true,
    },
    likes: [{type:String}],
    comments: {
        text: {type: String, required: false},
        username:{type:String, required:false},
        userId: {type: String, required:false},
    },
}, {timestamps:true});

const Post = mongoose.model('Post', postSchema);

export default Post;
