const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: { type: String, required: true },
    videoUrl: { type: String },
    publicId: { type: String },
    isPreviewFree: { type: Boolean },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Link to Course
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lecture", lectureSchema);
