const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db");
const { execFile } = require("child_process");
const fs = require("fs");

const app = express();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${extension}`;

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage
});


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
  try {
    const originalName = req.file.originalname;
    const storedName = `${Date.now()}.jpg`;

    await new Promise((resolve, reject) => {
  execFile(
    "sips",
    [
      "-s",
      "format",
      "jpeg",
      req.file.path,
      "--out",
      `uploads/${storedName}`
    ],
    (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    }
  );
});

    const result = await db.query(
      `INSERT INTO photos (filename, stored_filename)
       VALUES ($1, $2)
       RETURNING *`,
      [
        originalName,
        storedName
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});