import express from 'express';
import { addMovieComment, deleteMovieComment, getMovieComments, updateMovieComment } from '../controllers/comment.controller.js';


const router = express.Router();

router.post("/:movieId", addMovieComment);
router.get("/:movieId", getMovieComments);
router.put("/update/:commentId", updateMovieComment);
router.delete("/delete/:commentId", deleteMovieComment);

export default router;