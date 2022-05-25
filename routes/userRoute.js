import express from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  confirmAccount,
  changePassword,


} from "../controllers/userController.js";

const router = express.Router();


router.get("/:id", getUser);
router.get("/confirm/:token", confirmAccount)
router.post("/register", createUser);
router.post("/changePassword", changePassword);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
