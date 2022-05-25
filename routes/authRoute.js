import express from "express";
import {
    readToken,
    logout,
    login


} from "../controllers/authController.js";

const router = express.Router();

// router.get("/", getAllUsers);
router.post("/", login);
router.get("/", readToken);
router.get("/logout", logout)

export default router;