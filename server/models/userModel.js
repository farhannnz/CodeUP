const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { // Changed from "name" to "role"
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    enrolledCourses: [ // Fixed typo in "enrolledCourses"
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lecture",
      },
    ],
    photo_url: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
