import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";


const app = express();
const port = ENV_VARS.PORT || 3001;


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(cookieParser())
app.use("/images", express.static("public/uploads"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
  connectDB();
});
