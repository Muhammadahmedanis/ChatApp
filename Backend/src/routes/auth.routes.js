// import { changeCurrentPassword, forgotPassword, googleSignin, logout, refreshAccessToken, resendOtp, signin, signup, verifyEmail } from "../controllers/auth.controller.js";
// import { createRateLimiter } from "../middlewares/rate-limiting.middlware.js";

import { Router } from "express";
import { getUserData, logout,signin, signup } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const authRouter = Router();
authRouter.route("/signup").post(signup);
authRouter.route("/signin").post(signin);
authRouter.route("/logout").post(verifyJwt, logout);
authRouter.route("/get").get(verifyJwt, getUserData);

// authRouter.route("/google-signin").post( createRateLimiter(4 * 60 * 1000, 10, "Too much signin request hit, please try again after four minute"), googleSignin);
// authRouter.route("/verify-email").post(verifyJwt, verifyEmail)
// authRouter.route("/resend-otp").post( createRateLimiter(4 * 60 * 1000, 10, "Too much resendItp request hit, please try again after four minute"), resendOtp);
// authRouter.route("/forgot-password").post(forgotPassword);
// authRouter.route("/change-password/:token").post(changeCurrentPassword)
// authRouter.route("/refresh-token").post(refreshAccessToken);
export default authRouter;