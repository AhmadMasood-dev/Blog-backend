import multer from "multer";
import fs from "fs";
import os from "os";
import path from "path";
const TEMP_UPLOAD_DIR = process.env.TEMP_UPLOAD_DIR || path.join(os.tmpdir(), "uploads");

try {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
} catch (e) {

  console.error("Failed to ensure temp upload dir", e);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


export const TEMP_DIR_PATH = TEMP_UPLOAD_DIR;