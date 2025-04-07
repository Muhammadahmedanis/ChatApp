import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { responseMessages } from "../constant/responseMessages.js";
import { User } from "../models/user.model.js";
import { refreshAccessToken } from "../controllers/auth.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const { UNAUTHORIZED_REQUEST, INVALID_TOKEN } = responseMessages

export const verifyJwt = asyncHandler(async (req, res, next) => {
    let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED_REQUEST);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, INVALID_TOKEN);
        }

        req.user = user;
        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            const refreshSuccess = await refreshAccessToken(req, res);
            if (refreshSuccess) {
                return next(); 
            } else {
                return; 
            }
        }
        throw new ApiError(StatusCodes.UNAUTHORIZED, INVALID_TOKEN);
    }
});

