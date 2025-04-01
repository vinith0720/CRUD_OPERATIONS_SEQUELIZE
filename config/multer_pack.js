import multer from "multer";
import multers3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();
const bucket = process.env.AWS_BUCKET
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


const s3 = new S3Client({
    region : process.env.AWS_REGION,
    Credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY    
    }
});

const awsUpload = multer({
    storage: multers3({
        s3:s3,
        bucket:process.env.AWS_BUCKET,
        // acl : "public-read",
        metadata:(req,file,cb) =>{
            cb(null,{fieldName:file.fieldname})
        },
        key:(req,file,cd)=>{
            const fileName = `uploads/${Date.now()}-${file.originalname}`; 
            cd(null,fileName)
        }
    }),
    limits :{fileSize : 5 * 1024 * 1024}
});

export {bucket,upload,awsUpload,s3};

// "fileUrl": "https://vinithtestingbucket.s3.ap-south-1.amazonaws.com/uploads/1743488710030-7002199.webp"