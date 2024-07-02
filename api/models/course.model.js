import { Schema, model } from "mongoose";

const course = new Schema({
  email: {
    type: String,
    require: [true, 'Email is required'],
    trim: true,
    lowercase: true
  }, 

  title: {
    type: String,
    require: [true, 'title is required'],
    trim: true,
    capitalize: true,
  },

  overview: {
    type: String,
    require: [true, 'overview is nessaccary'],
    trim: true,
  },

  description: {
    type: String,
    require: [true, 'overview is nessary'],
    trim: true
  },

  preRequisites: {
    type: [String],
    require: [true, 'At least one preRequist is required']
  },

  learnings: {
    type: [String],
    require: [true, "atleast one learing is required"]
  },

  lectures: [
    {
      title: String,
      description: String,
      lecture: {
        public_id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        },
      },
    },
  ],

  thumbnail: {
    type: String,
    require: [true, 'thumbnail is required']
  },

  video: {
    type: String,
    require: [true, 'Introdiction video is required']
  }
}, {
  timestamps: true
})

const Course = model('course', course);
export default Course;