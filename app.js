import dotenv from "dotenv";
dotenv.config(); // should be at the very top
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./BACK-END/database/connectDB.js";
import { ApiError, globalError } from "./BACK-END/utils/error.js";
import userRouter from "./BACK-END/routers/users.routers.js";
import passport from "passport";
import session from "express-session";
import postRouter from "./BACK-EDND/routers/post.routers.js";
import commentRouter from "./BACK-END/routers/comment.routers.js";
import replyRouter from "./BACK-END/routers/reply.routers.js";
import logger from "./BACK-END/utils/logger.js";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://www.vericapture.com.ng",
      "https://www.vericapture.com.ng", // Add your production domain here
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true, // Prevents access to cookies via JavaScript
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Define the routes with different base paths
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter); // Change to a unique path
app.use("/api/v1/comments", commentRouter); // Change to a unique path
app.use("/api/v1/replies", replyRouter); // Change to a unique path

// 404 Handler
app.all("*", (req, res, next) => {
  const error = new ApiError(
    404,
    `Can't find ${req.originalUrl} on the server`
  );
  return next(error);
});

// Global Error Handler
app.use(globalError);

async function startServer() {
  await connectDB();

  app.listen(process.env.PORT, () => {
    logger.info(`Server is listening on http://localhost:${process.env.PORT}`);
  });
}

startServer();
