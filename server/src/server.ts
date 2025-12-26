import "dotenv/config";
import express from "express";
import morganMiddleware from "./middlewares/morganMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { addTraceId } from "./middlewares/miscMiddleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(addTraceId);
app.use(morganMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
