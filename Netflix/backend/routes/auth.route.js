import express from 'express';
import { authCheck, deleteUser, getUsers, login, logout, makeAdmin, signup, updateUser, verifyEmail } from '../controllers/auth.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/signup',  upload.single("file"), signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/verify/:token", verifyEmail);
router.put("/users/:id/admin", makeAdmin)
router.delete("/users/:id", deleteUser)
router.put("/update/:id",  upload.single('image'), updateUser);
router.get("/users", getUsers)

router.get("/authCheck", protectRoute,  authCheck)

export default router;