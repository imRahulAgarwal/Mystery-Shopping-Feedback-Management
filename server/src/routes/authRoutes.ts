import express from "express";
import * as auth from "../controllers/auth.js";
import { isNotLoggedIn } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.use(isNotLoggedIn);
authRouter.post("/login", auth.login);

export default authRouter;
