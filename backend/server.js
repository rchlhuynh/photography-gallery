const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const db = require("./db");

const app = express();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${extension}`;

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


app.get("/api/photos", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM photos"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/photos/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Find the photo in the database
    const result = await db.query(
      "SELECT * FROM photos WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Photo not found" });
    }

    const photo = result.rows[0];

    // Delete the actual image file
    const filePath = path.join(__dirname, "uploads", photo.stored_filename);

    fs.unlink(filePath, (error) => {
      if (error && error.code !== "ENOENT") {
        console.error(error);
      }
    });

    // Delete the database record
    await db.query(
      "DELETE FROM photos WHERE id = $1",
      [id]
    );

    res.json({ message: "Photo deleted" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});

app.post("/api/photos", upload.single("photo"), async (req, res) => {
  let storedName;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No photo uploaded" });
    }

    const originalName = req.file.originalname;
    storedName = `${Date.now()}.jpg`;

    const outputPath = path.join(uploadDir, storedName);

    await sharp(req.file.path)
      .rotate()
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    const result = await db.query(
      `INSERT INTO photos (filename, stored_filename)
       VALUES ($1, $2)
       RETURNING *`,
      [originalName, storedName]
    );

    // Remove the original temporary upload after conversion
    await fs.promises.unlink(req.file.path);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    // Clean up files if the upload or database insert fails
    if (req.file?.path) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }

    if (storedName) {
      await fs.promises.unlink(path.join(uploadDir, storedName)).catch(() => {});
    }

    res.status(500).json({ error: "Upload failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});