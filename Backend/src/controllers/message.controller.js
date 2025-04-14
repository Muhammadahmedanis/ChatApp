import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responseMessages } from "../constant/responseMessages.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {v2 as cloudinary} from "cloudinary"
const { MISSING_FIELDS, USER_EXISTS, UN_AUTHORIZED, SUCCESS_REGISTRATION, DELETED_SUCCESS_MESSAGES, NO_USER, SUCCESS_LOGIN, INVALID_OTP, OTP_EXPIRED, EMAIL_VERIFY, SUCCESS_LOGOUT, MISSING_FIELD_EMAIL_PASSWORD, UNAUTHORIZED_REQUEST, GET_SUCCESS_MESSAGES, RESET_LINK_SUCCESS, PASSWORD_CHANGE, NOT_VERIFY, PASSWORD_AND_CONFIRM_NO_MATCH, UPDATE_UNSUCCESS_MESSAGES, MISSING_FIELD_EMAIL, RESET_OTP_SECCESS, INVALID_TOKEN, TOKEN_EXPIRED, SUCCESS_TOKEN, INVALID_DATA, NO_DATA_FOUND, IMAGE_SUCCESS, IMAGE_ERROR , UPDATE_SUCCESS_MESSAGES, UNAUTHORIZED, NOT_ALLOWED, EMPTY_URL_PARAMS} = responseMessages

export const sendMsg = asyncHandler(async (req, res) => {
    const { recipientId, text } = req.body
    const senderId = req?.user?._id;
    if(!senderId){
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED);
    }

    let conversation = await Conversation.findOne({
        participants: { $all : [senderId, recipientId] },
    })
    if(!conversation){
        conversation = new Conversation({
            participants: [senderId, recipientId],
            lastMessage: {
                text,
                sender: senderId,
            }
        })
        await conversation.save();
    }

    let imageUrl = null;
    if (req.file) {
        const uploadedImage = await uploadOnCloudinary(req.file.path);
        if (!uploadedImage) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, IMAGE_FAIL);
        }
        imageUrl = uploadedImage.secure_url;
    }

    const newMsg = new Message({
        conversationId: conversation?._id,
        sender: senderId,
        text,
        img: imageUrl,
    });

    await Promise.all([
        newMsg.save(),
        conversation.updateOne({
            lastMessage: {
                text,
                sender: senderId
            }
        })
    ])
    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', newMsg));
})



export const getMessages = asyncHandler(async (req, res) => {
    const { otherUserId } = req.params;
    if(!otherUserId){
        throw new ApiError(StatusCodes.BAD_REQUEST, EMPTY_URL_PARAMS)
    };

    const userId = req?.user?._id;
    if(!userId){
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED);
    };

    const conversation = await Conversation.findOne({
        participants: { $all: [ userId, otherUserId ] }
    })
    if(!conversation){
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', []));
    };

    const message = await Message.find({
        conversationId: conversation?._id
    })

    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, "", message));
})




export const getConversations = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    if(!userId){
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED);
    };

    const conversation = await Conversation.find({ participants: userId }).populate({
        path: "participants",
        select: "userName profilePic"
    })
    if(!conversation){
        throw new ApiError(StatusCodes.NOT_FOUND, NO_DATA_FOUND);
    }

    conversation.forEach(conversation => {
        conversation.participants = conversation?.participants?.filter(
            participants => participants?._id.toString() !== userId?.toString()
        );
    })

    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, "", conversation));
})





export const deleteMsg = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    if(!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED); 
    
    const { id: messageId } = req.params;
    if(!messageId) throw new ApiError(StatusCodes.BAD_REQUEST, EMPTY_URL_PARAMS)

    const message = await Message.findById(messageId);
    if(!message) throw new ApiError(StatusCodes.BAD_REQUEST, NO_DATA_FOUND);
    
    if (message?.img) {
        try {
            const urlParts = message.img.split('/');
            const publicId = urlParts.slice(-2).join('/').split('.')[0]; // Correctly extract the public ID
            const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
            // console.log("Cloudinary Response:", cloudinaryResponse);

            if (cloudinaryResponse.result !== 'ok') {
                throw new Error(`Failed to delete image from Cloudinary: ${cloudinaryResponse.result}`);
            }
        } catch (error) {
            console.error("Cloudinary deletion failed:", error.message);
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Image deletion failed");
        }
    }

    const conversationId = message?.conversationId;
    await message.deleteOne();

    if(conversationId){
        const conversation = await Conversation.findById(conversationId);
        const isLastMessage =
        conversation?.lastMessage?.text === message.text &&
        conversation?.lastMessage?.sender?.toString() === message.sender?.toString();
        if (isLastMessage) {
            const [latestMsg] = await Message.find({ conversationId }).sort({ createdAt: -1 }).limit(1);
            conversation.lastMessage = latestMsg
            ? { text: latestMsg.text, sender: latestMsg.sender }
            : null;
            await conversation.save(); 
        }
    }

    res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', DELETED_SUCCESS_MESSAGES));
})




export const editMessage = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    if(!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED); 
    
    const { id: messageId } = req.params;
    if(!messageId) throw new ApiError(StatusCodes.BAD_REQUEST, EMPTY_URL_PARAMS);

    const { text } = req.body;
    if(!text) throw new ApiError(StatusCodes.BAD_REQUEST, 'No data provide');

    const message = await Message.findById(messageId);
    if(!message) throw new ApiError(StatusCodes.BAD_REQUEST, NO_DATA_FOUND);

    if(message?.text != text){
        const conversation = await Conversation.findById(message.conversationId);

        const isLastMessage = 
        conversation?.lastMessage?.text === message?.text &&
        conversation?.lastMessage?.sender?.toString() === message?.sender?.toString();

        message.text = text;
        await message.updateOne({ text });

        if(isLastMessage){
            conversation.lastMessage.text = text;
            await conversation.save()
        }
    }
    const updatedMessage = await Message.findById(messageId); 
    res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, UPDATE_SUCCESS_MESSAGES, updatedMessage));
})