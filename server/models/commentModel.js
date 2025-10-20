const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    lectureId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Lecture", 
      required: true 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    likes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    replies: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
