import express from 'express';
import { authCheck, login, logout, signup, verifyEmail } from '../controllers/auth.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/signup',  upload.single("file"), signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/verify/:token", verifyEmail);

router.get("/authCheck", protectRoute,  authCheck)

export default router;