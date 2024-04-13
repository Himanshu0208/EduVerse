import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendmail from "../utils/sendmail.util.js"
import crypto from "crypto"

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production' ? true : false,
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
}

/**
 * @route @post {{URL}}/register
 * @access Public
 */
export const register = async (req, res, next) => {
  try {
    const {fullName, email, password, role} = req.body;
    if(!fullName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }
    
    const userExist = await User.findOne({email: email});
    if(userExist) {
      return next(new AppError("Email All ready exist", 400));
    }
  
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      avatar: {
        public_id: email,
        secure_url: "https://res.cloudinary.com/dm2c7g7zk/image/upload/v1712928690/EduVerse/profile/x5qn9xu3oisuvm0qcq1j.png",
      }
    })
  
    if(!user) {
      return next(new AppError("Registration Failed, try again later", 500));
    }
  
    // TODO: file upload
    if(req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "EduVerse/avatar",
          width: 250,
          height: 250,
          gravity: 'faces',
          crop: 'fill'
        })

        if(result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
        }
        
        fs.rm(`uploads/${req.file.filename}`)

      } catch (error) {
        return next(new AppError(error.message, 500));
      }
    }
    await user.save();
    user.password = undefined;
  
    const token = await user.genrateJwtToken();
    res.cookie('token', token, cookieOptions)
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

/**
 * @route @post {{URL}}/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const {email, password} = req.body;

    if(!email || !password) {
      return next(new AppError("Email and Password are mandatory",400));
    }
  
    const user = await User.findOne({email: email}).select('+password');
    if(!(user && (await user.comparePassword(password)))) {
      return next(new AppError("Email or Password is wrong", 400));
    }
  
    user.password = undefined;
    const token = await user.genrateJwtToken();
    res.cookie('token', token, cookieOptions);
  
    res.status(200).json({
      success: true,
      message: "User Logged In successfully",
      data: user
    })
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

/**
 * @route @get {{URL}}/logout
 * @access Private( LoggedIn user only )
 */
export const logout = (req, res, next) => {
  res.cookie('token', null, {
    secure: true,
    maxAge: 0,
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: "User Logged Out Successfully"
  })
}

export const getProfile = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if(!user) {
    return next(new AppError("User does not exist", 400));
  }

  res.status(200).json({
    success: true,
    message: "User Found Successfully",
    data: user
  })
}

/**
 * @route @post {{URL}}/forgotpassword
 * @access Private( LoggedIn user only )
 */
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if(!email) {
    return next(new AppError('Email is required', 400));
  }

  const user = await User.findOne({email: email});
  if(!user) {
    return nextTick(new AppError('Email is not registerd', 400));
  }

  const token = await user.genrateForgotPasswordToken();
  await user.save();

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset/${token}`

  try {
    console.log(resetPasswordUrl);
    // await sendmail(email, "forgot password", `To change your password: <a href=${resetPasswordUrl}>Click Here</a>`);
    res.status(201).json({
      success: true,
      message: `A mail to reset your password is sent to your registered email`
    });
  } catch(error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();
    return next(new AppError(`Unabled to send mail or save information: ${error.message}`, 500));
  }
}

/**
 * @route @post {{URL}}/reset/:resetToken
 * @access Public
 */
export const resetPassword = async(req, res, next) => {
  try {
    const {resetToken} = req.params;
    const {password} = req.body;
  
    const forgotPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    if(!password) {
      return next(new AppError("new password is required"));
    }
  
    const user = await User.findOne({
      forgotPasswordToken: forgotPasswordToken,
      forgotPasswordTokenExpiry: {$gt : Date.now()},
    })
  
    if(!user) {
      return next(new AppError("Token is invalid or expired", 400));
    }
  
    user.password = password;
  
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
  
    await user.save();
    res.status(201).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    return next(new AppError(`An Error occured: ${error.message}`, 500));
  }
}

/** 
 * @route @put {{URL}}/changepassword
 * @access Private ( LoggedIn user only )
*/
export const changePassword = async (req, res, next) => {
  try {
    const {id} = req.user;
    const {newPassword, oldPassword} = req.body;
  
    if(!newPassword || !oldPassword) {
      return next(new AppError("Old and New Password is required", 400));
    }
  
    const user = await User.findById(id).select('+password');
    const isOldPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isOldPasswordCorrect) {
      return next(new AppError("Old password is incorrect", 400));
    }
  
    user.password = password;
    await user.save();
  
  
    user.password = undefined;
    res.status(201).json({
      success: true,
      message: "Password Changed Successfully"
    }) ; 
  } catch (error) {
    return next(new AppError(`Failed to update password ${error.message}`, 500))
  }

}

/**
 * @route @put {{URL}}/update/:id
 * @access Private( LoggedIn User only)
 */
export const updateUser = async (req, res, next) => {
  try {
    const {id} = req.user;
    const { fullName, role } = req.body;
    
    const user = await User.findById(id);
    if(!user) {
      return next(new AppError("User id does't exist", 400));
    }
  
    user.fullName = fullName;
    user.role = role;
  
    await user.save();
    res.status(201).json({
      success: true,
      message: "User updated successfully"
    });
  } catch (error) {
    return next(new AppError(`Unable to update user: ${error.message}`, 500));
  }
}
