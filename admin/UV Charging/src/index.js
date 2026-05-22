
import "dotenv/config";
import mongoose from "mongoose";
import { MONGO_URL, PORT } from "./config/config.js";
import app from "./app.js";

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

await mongoose.connect(MONGO_URL);
console.log("Connected to MongoDB");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
