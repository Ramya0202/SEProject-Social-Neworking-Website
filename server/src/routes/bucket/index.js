import express from "express";
const router = express.Router();
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

router.put("/:filename", upload.single("file"), (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `src/uploads/images/${filename}`;
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Remove the existing file
      fs.unlinkSync(filePath);
    }
    // Do something with the new file here
    return res.status(200).json("File updated successfully");
  } catch (error) {
    console.error(error);
  }
});

export default router;
