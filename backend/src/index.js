import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { initSocket } from "./config/socket.js";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);
initSocket(server);

const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

app.use(errorMiddleware);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Kết nối với Mongoose thành công!");
  })
  .catch((err) => {
    console.error("Không thể kết nối với Mongoose!", err);
  });

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
