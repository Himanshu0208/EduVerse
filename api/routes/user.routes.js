import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { 
  forgotPassword, 
  getProfile, 
  login, 
  logout, 
  register, 
  resetPassword,
  updateUser
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", upload.single('avatar') , register);
router.post("/login", upload.none(), login);
router.get("/logout", isLoggedIn, logout);
router.post("/profile", getProfile);
router.post("/forgotPassword", isLoggedIn, forgotPassword);
router.post("/reset/:resetToken", resetPassword);
router.put("/update/:id", isLoggedIn, upload.single("avatar"), updateUser)

export default router;