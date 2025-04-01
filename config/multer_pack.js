import multer from "multer";
import multers3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
  
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }
    return cb(new Error("upload only images are allowed !"), false);
  },
});


const s3 = S3Client({
    region : process.env.AWS_REGION,
    Credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SCRET_ACCESS_KEY    
    }
});

const awsUpload = multer({
    storage: multers3({
        s3:s3,
        bucket:process.env.AWS_BUCKEET,
        acl : "public-read",
        metadata:(req,file,cb) =>{
            cb(null,{fieldName:file.fieldName})
        },
        key:(req,file,cd)=>{
            const fieldName = `uploads/${Date.now()}-${file.originalname}`; 
            cd(null,fileName)
        }
    }),
    limits :{fileSize : 5 * 1024 * 1024}
});

export {upload,awsUpload};