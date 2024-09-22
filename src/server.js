const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer"); // Multer for file uploads
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 8443;
const path = require("path");

// MongoDB connection¸
const uri =
  "mongodb+srv://admin:LRw1ntGzyXjN5mMd@cluster0.yqst6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const uri = "mongodb://localhost:27017"; // Your MongoDB URI
const client = new MongoClient(uri, { useUnifiedTopology: true });
const dbName = "csvreader";
let db, bucket;

client.connect().then(() => {
  db = client.db(dbName);
  bucket = new GridFSBucket(db);
  console.log("Connected to MongoDB");
});

app.use(
  cors({
    origin: "https://66f01db1da8e37afc60776cd--large-csv-reader.netlify.app",
  })
);
app.use(bodyParser.json({ limit: "1gb" }));
app.use(bodyParser.urlencoded({ limit: "1gb", extended: true }));

// Set up Multer for file handling
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// Updated endpoint to accept file upload
app.post("/upload-csv", upload.single("file"), async (req, res) => {
  const file = req.file; // Access the uploaded file from req.file
  console.log(req);
  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  try {
    // Find existing files and delete them
    const existingFiles = await bucket.find().toArray();
    for (const existingFile of existingFiles) {
      await bucket.delete(existingFile._id);
    }

    // Create an upload stream using GridFSBucket
    const uploadStream = bucket.openUploadStream("csv_file");

    // Upload the file buffer (from memory) to MongoDB GridFS
    uploadStream.end(file.buffer);

    uploadStream.on("finish", () => {
      res
        .status(200)
        .json({ success: true, message: "File uploaded successfully" });
    });

    uploadStream.on("error", (error) => {
      console.error("Error uploading file:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to upload file" });
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ success: false, message: "Failed to insert data" });
  }
});

app.get("/download-csv", async (req, res) => {
  try {
    // Find the file in GridFS
    const files = await bucket.find().toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ success: false, message: "No file found" });
    }

    // Set response headers
    res.set({
      "Content-Type": "text/csv", // Change this based on the file type
      "Content-Disposition": `attachment; filename=${files[0].filename}`,
    });

    // Create a download stream and pipe it to the response
    const downloadStream = bucket.openDownloadStream(files[0]._id);
    downloadStream.pipe(res);

    downloadStream.on("error", (error) => {
      console.error("Error retrieving file:", error);
      res
        .status(500)
        .json({ success: false, message: "Error retrieving file" });
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ success: false, message: "Error retrieving file" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
