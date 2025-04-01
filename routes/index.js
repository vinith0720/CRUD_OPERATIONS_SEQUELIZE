import {upload , awsUpload} from "../config/multer_pack.js";
import express from "express";
var router = express.Router();


/* GET home page. */

router.get('/', function(req, res, next) {
  res.send("express is working !")
});


router.post("/upload",upload.single('file'),(req,res) =>{
  console.log("Uploaded File:", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({"file":req.file});
});

export default router;
