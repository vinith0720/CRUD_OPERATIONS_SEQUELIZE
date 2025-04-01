import {s3, upload, awsUpload,bucket} from "../config/multer_pack.js";
import { DeleteObjectCommand ,ListObjectsV2Command } from "@aws-sdk/client-s3";
import express from "express";
var router = express.Router();


/* GET home page. */

router.get('/', function(req, res, next) {
  res.send("express is working !")
});


router.post("/upload", upload.single("file"), (req, res) => {
  console.log("Uploaded File:", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.status(200).json({ file: req.file });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

router.post("/aws", awsUpload.single("file"), (req,res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the URL of the uploaded file on S3
    res.json({
      message: "File uploaded successfully",
      fileUrl: req.file.location, // S3 URL of the uploaded file
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

router.delete("/aws",async(req,res) =>{
  const filepath = req.body.filepath
  if(!filepath){
    return res.status(400).json({"error":"give the path of the deleted file"});
  }
  const params = {
    Bucket: bucket,
    Key: filepath 
  };
  try {
    const command = new DeleteObjectCommand(params);
    const result = await s3.send(command)
    res.status(200).json({msg: "deleted successully", result:result})
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ msg: 'Error deleting file', err:error });
  }
});

router.get("/aws", async (req, res) => {
  try {
    const param = { Bucket: bucket };
    const command = new ListObjectsV2Command(param);
    const result = await s3.send(command);
    if (!result.Contents || result.Contents.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }
    const files = result.Contents.map((file) => ({
      fileName: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    }));
    res.status(200).json({ files });
  } catch (error) {
    console.log("Error getting file", error);
    res.status(500).json({ error });
  }
});

export default router;
