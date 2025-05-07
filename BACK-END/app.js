import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/connectDB.js";
import { ApiError, globalError } from "./utils/error.js";
import userRouter from "./routers/users.routers.js";
import passport from "passport";
import session from "express-session";
import postRouter from "./routers/post.routers.js";
import commentRouter from "./routers/comment.routers.js";
import replyRouter from "./routers/reply.routers.js";
import logger from "./utils/logger.js";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:5173', 
      'http://127.0.0.1:5173', 
      'https://www.vericapture.com.ng',
	'https://www.vericapture.com.ng', // Add your production domain here
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
app.use("/api/v1/posts", postRouter);  // Change to a unique path
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

