import express from "express";
import dotenv from "dotenv"
import { ConnectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"


const app = express();
dotenv.config();

app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.listen(5500, () => {
    ConnectDB();
    console.log("Server started at http://localhost:5500");
});