import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import otpgenrator from "otp-generator";
import crypto from "crypto";

const userSchema = new Schema({
  fullName: {
    type: String,
    require: [true, 'Name is required'],
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    require: [true, 'Email is required'],
    trim: true,
  },

  password: {
    type: String,
    require: [true, 'Password is required'],
    minLen: [8, 'Password must be at least of 8 chars'],
    select: false,
  },

  role: {
    type: String,
    enum: ['student', 'teacher', 'organisation'],
    default: 'student',
    lowercase: true,
  },

  courses : {
    type: String,
    // default: [],
  },

  avatar: {
    public_id: {
      type: String,
    },
    
    secure_url: {
      type: String,
    }
  },

  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods = {
  comparePassword: async function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password)
  },

  genrateJwtToken: async function() {
    return jwt.sign(
      {id: this._id, email: this.email, role: this.role , courses: this.courses},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRY}
    )
  },

  genrateForgotPasswordToken: async function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.forgotPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000; // 5 mins from now

    return token;
  }
}

const User = model("user", userSchema);
export default User;