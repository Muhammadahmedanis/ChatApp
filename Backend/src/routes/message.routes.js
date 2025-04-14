import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deleteMsg, editMessage, getConversations, getMessages, sendMsg } from "../controllers/message.controller.js";
import { upload } from '../middlewares/multer.middlware.js'

const messageRouter = Router()
messageRouter.route('/conversations').get(verifyJwt, getConversations);
messageRouter.route('/:otherUserId').get(verifyJwt, getMessages);
messageRouter.route('/send').post(verifyJwt, upload.single('img'), sendMsg);
messageRouter.route('/deleteMessage/:id').delete(verifyJwt, deleteMsg);
messageRouter.route('/editMessage/:id').put(verifyJwt, editMessage);

export default messageRouter;