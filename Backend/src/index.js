import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
import { server } from "./socket/socket.js";
import { app } from './app.js'

// Load environment variables
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;

// Database Connection and Server Start
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit the process if the DB connection fails
});