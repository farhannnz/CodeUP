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
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    enrolledCourses: [
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
    notes: [
      {
        lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
        content: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    likedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
