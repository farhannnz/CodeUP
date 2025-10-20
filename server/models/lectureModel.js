const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String, default: "" },
    duration: { type: String, default: "" },
    publicId: { type: String },
    isPreviewFree: { type: Boolean, default: false },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    resources: [
      {
        title: { type: String },
        url: { type: String },
        type: { type: String, enum: ["pdf", "link", "file"], default: "link" }
      }
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lecture", lectureSchema);
