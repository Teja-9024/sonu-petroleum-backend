import express from "express";
import router from "./routes";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import connectToDatabase from "./config/database";

const app = express();

app.use(express.json());
app.use(cookieParser());
connectToDatabase()
app.use(router);

export default app;