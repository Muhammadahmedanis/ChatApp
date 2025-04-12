import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responseMessages } from "../constant/responseMessages.js";
import { text } from "express";
const { MISSING_FIELDS, USER_EXISTS, UN_AUTHORIZED, SUCCESS_REGISTRATION, NO_USER, SUCCESS_LOGIN, INVALID_OTP, OTP_EXPIRED, EMAIL_VERIFY, SUCCESS_LOGOUT, MISSING_FIELD_EMAIL_PASSWORD, UNAUTHORIZED_REQUEST, GET_SUCCESS_MESSAGES, RESET_LINK_SUCCESS, PASSWORD_CHANGE, NOT_VERIFY, PASSWORD_AND_CONFIRM_NO_MATCH, UPDATE_UNSUCCESS_MESSAGES, MISSING_FIELD_EMAIL, RESET_OTP_SECCESS, INVALID_TOKEN, TOKEN_EXPIRED, SUCCESS_TOKEN, INVALID_DATA, NO_DATA_FOUND, IMAGE_SUCCESS, IMAGE_ERROR , UPDATE_SUCCESS_MESSAGES, UNAUTHORIZED, NOT_ALLOWED, EMPTY_URL_PARAMS} = responseMessages

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

    const newMsg = new Message({
        conversationId: conversation?._id,
        sender: senderId,
        text,
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
        throw new ApiError(StatusCodes.BAD_REQUEST, NO_DATA_FOUND)
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