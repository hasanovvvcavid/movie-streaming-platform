import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  searchHistory: {
    type: Array,
    default: [],
  },
  favorites: [
    {
      movieId: String,
      title: String,
      poster: String,
    },
  ],
  watchLater: [
    {
      movieId: String,
      title: String,
      poster: String,
    },
  ],
  isVerified: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  isCreated: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
export const User = mongoose.model("User", userSchema);
