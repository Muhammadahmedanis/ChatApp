import express from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app } from "./socket/socket.js";

// Middleware Configurations
app.use(cors({
  origin: [process.env.ALLOWED_ORIGIN_1, process.env.ALLOWED_ORIGIN_2],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Welcome to My Page")
})

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/msg", messageRouter);

// Handle Undefined Routes
app.all("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export { app };