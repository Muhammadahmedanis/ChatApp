import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getConversations, getMessages, sendMsg } from "../controllers/message.controller.js";

const messageRouter = Router()
messageRouter.route('/conversations').get(verifyJwt, getConversations);
messageRouter.route('/:otherUserId').get(verifyJwt, getMessages);
messageRouter.route('/').post(verifyJwt, sendMsg)

export default messageRouter;