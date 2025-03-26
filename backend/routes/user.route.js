import express from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controller/user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);


export default router;