import "dotenv/config";
import express from "express";
import morganMiddleware from "./middlewares/morganMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { addTraceId } from "./middlewares/miscMiddleware.js";
import panelRouter from "./routes/panelRoutes.js";
import connectDatabase from "./configs/connectDatabase.js";
import initialize from "./utils/init.js";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").filter((origin) => origin.trim() !== "") || [];

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDatabase();
await initialize();

app.use(addTraceId);
app.use(morganMiddleware);

app.use("/api/auth", authRouter);
app.use("/panel/api", panelRouter);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
