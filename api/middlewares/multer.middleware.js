import path from "path";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: {fileSize: 100 * 1024 * 1024},
  storage: multer.diskStorage({
    destination: "uploads/",
    fileName: function (req, file, cb) {
      console.log("File Name > ", file.originalname);
      cb(null, file.originalname);
    }
  }),
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname)
    if(ext != '.jpg' && ext != '.jpeg' && ext !='.png' && ext != '.mp4') {
      cb(new Error(`Unsuported file type: ${ext}`), false);
    }
    cb(null, true);
  }
})

export default upload;