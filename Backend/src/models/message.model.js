import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
}, { timestamps: true})

export const Message = mongoose.model("Message", messageSchema);