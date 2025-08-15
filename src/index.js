import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from './app.js';

dotenv.config({ path: "./.env" });

let dbInitPromise = null;
async function initDBOnce() {
  if (!dbInitPromise) {
    dbInitPromise = connectDB()
      .then(() => console.log("MongoDB connected (serverless handler)"))
      .catch(err => {
        dbInitPromise = null;
        throw err;
      });
  }
  return dbInitPromise;
}


export default async function handler(req, res) {
  try {
    await initDBOnce();
    return app(req, res);
  } catch (err) {
    console.error("Handler error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}


export const api = handler;

if (!process.env.VERCEL) {
  initDBOnce()
    .then(() => {
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error("Failed to start server:", err);
      process.exit(1);
    });
}