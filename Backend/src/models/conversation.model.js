import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    lastMessage: {
        text:{
            type: String
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
}, { timestamps: true })

export const Conversation = mongoose.model("Conversation", conversationSchema);