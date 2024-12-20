import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    text: String,
    file: String,
}, {timestamps:true});

const Message = mongoose.model('Message', messageSchema);

export default Message;
