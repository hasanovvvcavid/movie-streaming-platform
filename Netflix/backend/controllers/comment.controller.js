import CommentModel from "../models/comment.model.js";

export const addMovieComment = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { text, rating, userId } = req.body;

    console.log("Gelen veri:", { movieId, text, rating, userId });

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!text || !rating) {
      return res
        .status(400)
        .json({ error: "Comment text and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const newComment = new CommentModel({
      movieId,
      userId,
      text,
      rating,
      createdAt: new Date(),
    });

    await newComment.save();
    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMovieComments = async (req, res) => {
  try {
    const { movieId } = req.params;

    const comments = await CommentModel.find({ movieId }).populate(
      "userId",
      "username image"
    );

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMovieComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, isAdmin } = req.body;

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (!isAdmin && comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can't delete this comment" });
    }

    await CommentModel.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateMovieComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, rating, userId } = req.body;

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can't edit this comment" });
    }

    comment.text = text || comment.text;
    comment.rating = rating || comment.rating;
    comment.updatedAt = new Date();

    await comment.save();
    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
