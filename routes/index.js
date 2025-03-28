import express from "express";
import multer from "multer";
var router = express.Router();


const storage = multer.diskStorage({
  destination:(req,file,cb) => { cb(null,'./public/images')},
  filename:(req,file,cb) => {cb(null,`${Date.now()}-${file.originalname}`)}
});

const upload = multer({
              storage:storage,
              limits :{fileSize: 5 *1024 * 1024},
              fileFilter :(req,file,cb) => {
                            if(file.mimetype.startsWith("image/")){
                              return cb(null,true);
                            }
                            return cb(new Error("upload only images are allowed !"),false)
                        }
              });

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
