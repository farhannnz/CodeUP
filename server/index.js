const express = require("express");
const dotenv = require("dotenv");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const connectDB = require("./database/dbConnect");
const User = require("./models/userModel");
const Course = require("./models/courseModel");
const cors = require("cors");
const Lecture = require("./models/lectureModel");
const Comment = require("./models/commentModel");
const Razorpay = require("razorpay");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// Blacklist for token invalidation
const blacklistTokens = new Set();

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || blacklistTokens.has(token)) {
    return res.status(401).json({ success: false, message: "Unauthorized or Token Expired" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

// Function to hash passwords
const hashPassword = (password) => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
};

// Register API
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = hashPassword(password);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Logout API
app.post("/logout", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    // Token ko blacklist me add kar do
    blacklistTokens.add(token);

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Profile API (Protected)
app.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

app.put("/edit-profile", authenticateUser, async (req, res) => {
  const { fullName, email, photo_url } = req.body;

  console.log("Authenticated user:", req.user);
  console.log("Received data:", fullName, email, photo_url);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // Fixed: use req.user.id instead of req.user._id
      { fullName, email, photo_url },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
  }
});



app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses

    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

//API for Couse creation
app.post("/create-course", authenticateUser, async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return express.res.status(400).json({
        message: "All fields are required"
      })
    }
    const course = await Course.create({
      title,
      category
    })
    return express.res.status(201).json({
      course,
      message: "course created"
    })
  }
  catch (err) {
    console.log(err)
  }
})

// Edit Course API
app.put("/courses/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // ✅ Find the course and update it
    const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Course updated successfully", updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

app.get("/view-courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    const course = await Course.findById(id).populate('lectures');

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//Add lecture API 
app.post("/add-lecture/:id", authenticateUser, async (req, res) => {
  try {
    const { lectureTitle, videoUrl, description, duration, isPreviewFree, resources } = req.body;
    const { id: courseId } = req.params;

    console.log("Add lecture request:", { 
      courseId, 
      lectureTitle, 
      videoUrl, 
      description, 
      duration, 
      isPreviewFree, 
      resources 
    });

    if (!lectureTitle || !videoUrl) {
      return res.status(400).json({ 
        success: false,
        message: "Lecture title and video URL are required" 
      });
    }

    // Validate courseId
    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid Course ID" 
      });
    }

    // Get the current number of lectures to set order
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: "Course not found" 
      });
    }

    const lecture = new Lecture({
      lectureTitle,
      videoUrl,
      description: description || "",
      duration: duration || "",
      isPreviewFree: isPreviewFree || false,
      resources: resources || [],
      courseId,
      order: course.lectures.length
    });

    await lecture.save();
    console.log("Lecture saved:", lecture._id);

    course.lectures.push(lecture._id);
    await course.save();
    console.log("Course updated with new lecture");

    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.error("Error adding lecture:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
      error: error.toString()
    });
  }
});



app.get('/lectures/:lectureId', async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json({ lecture });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/course/:id", async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findById(courseId);
    res.json(course);
  } catch (error) {
    res.status(500).send("Error fetching course data");
  }
});


// Create Order API
/*
app.post("/create-order", authenticateUser, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    if (!amount || !currency) {
      return res.status(400).json({ success: false, message: "Amount and currency are required" });
    }

    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Verify Payment API
app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});*/

// Enroll in a course (POST request)
// Enroll in a course (POST request)
app.post("/enroll-course", authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // Assuming the user is logged in and we have the user ID available

    // Find the course by its ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if the user is already enrolled
    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }

    // Enroll the user by adding the userId to the course's enrolledStudents array
    course.enrolledStudents.push(userId);
    await course.save();

    // Also add this course to the user's enrolledCourses
    const user = await User.findById(userId);
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ success: true, message: "Successfully enrolled in the course" });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ success: false, message: "Enrollment failed", error: error.message });
  }
});


// Mark lecture as completed
app.post("/complete-lecture", authenticateUser, async (req, res) => {
  try {
    const { lectureId, courseId } = req.body;
    const userId = req.user.id;

    console.log("Mark as complete request:", { lectureId, courseId, userId });

    if (!lectureId || !courseId) {
      return res.status(400).json({ success: false, message: "Lecture ID and Course ID are required" });
    }

    // Find user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId).populate('lectures');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if lecture exists in course
    const lectureExists = course.lectures.some(lec => lec._id.toString() === lectureId.toString());
    if (!lectureExists) {
      return res.status(404).json({ success: false, message: "Lecture not found in this course" });
    }

    // Check if already completed
    const isAlreadyCompleted = user.completedLectures.some(
      id => id.toString() === lectureId.toString()
    );
    
    if (!isAlreadyCompleted) {
      user.completedLectures.push(lectureId);
      await user.save();
      console.log("Lecture marked as completed and saved");
    } else {
      console.log("Lecture was already completed");
    }

    // Calculate progress
    const totalLectures = course.lectures.length;
    const completedLecturesInCourse = course.lectures.filter(lecture => 
      user.completedLectures.some(id => id.toString() === lecture._id.toString())
    );
    const completedCount = completedLecturesInCourse.length;
    const progress = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

    console.log("Progress calculated:", { totalLectures, completedCount, progress });

    res.status(200).json({ 
      success: true, 
      message: "Lecture marked as completed",
      progress,
      completedCount,
      totalLectures,
      isCompleted: progress === 100,
      completedLectureIds: user.completedLectures.map(id => id.toString())
    });
  } catch (error) {
    console.error("Error completing lecture:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Get course progress
app.get("/course-progress/:courseId", authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    console.log("Get progress request:", { courseId, userId });

    // Validate course ID
    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId).populate('lectures');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const totalLectures = course.lectures.length;
    
    // Get completed lectures for this specific course
    const completedLecturesInCourse = course.lectures.filter(lecture => 
      user.completedLectures.some(id => id.toString() === lecture._id.toString())
    );
    
    const completedCount = completedLecturesInCourse.length;
    const progress = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

    console.log("Progress response:", { totalLectures, completedCount, progress });

    res.status(200).json({
      success: true,
      progress,
      completedCount,
      totalLectures,
      isCompleted: progress === 100,
      completedLectureIds: user.completedLectures.map(id => id.toString())
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Generate certificate (returns certificate data)
app.get("/generate-certificate/:courseId", authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    console.log("Generate certificate request:", { courseId, userId });

    const user = await User.findById(userId);
    const course = await Course.findById(courseId).populate('lectures');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if user is enrolled
    if (!user.enrolledCourses.some(id => id.toString() === courseId.toString())) {
      return res.status(403).json({ 
        success: false, 
        message: "You must be enrolled in this course to get a certificate" 
      });
    }

    // Check if course is completed
    const totalLectures = course.lectures.length;
    const completedLecturesInCourse = course.lectures.filter(lecture => 
      user.completedLectures.some(id => id.toString() === lecture._id.toString())
    );
    const completedCount = completedLecturesInCourse.length;
    const progress = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

    console.log("Certificate check:", { totalLectures, completedCount, progress });

    if (progress < 100) {
      return res.status(400).json({ 
        success: false, 
        message: `Course not completed yet. Progress: ${progress}%`,
        progress,
        completedCount,
        totalLectures
      });
    }

    // Generate certificate data
    const certificateData = {
      studentName: user.fullName,
      courseName: course.title,
      courseCategory: course.category,
      completionDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      certificateId: `CERT-${Date.now()}-${userId.toString().slice(-6).toUpperCase()}`,
      issueDate: new Date().toISOString(),
      totalLectures,
      studentEmail: user.email
    };

    console.log("Certificate generated successfully");

    res.status(200).json({
      success: true,
      certificate: certificateData
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Update lecture API
app.put("/lectures/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { lectureTitle, videoUrl, description, duration, isPreviewFree, resources } = req.body;

    const updatedLecture = await Lecture.findByIdAndUpdate(
      id,
      { lectureTitle, videoUrl, description, duration, isPreviewFree, resources },
      { new: true }
    );

    if (!updatedLecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Lecture updated successfully", 
      lecture: updatedLecture 
    });
  } catch (error) {
    console.error("Error updating lecture:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Like/Unlike lecture
app.post("/lectures/:id/like", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const lecture = await Lecture.findById(id);
    const user = await User.findById(userId);

    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    const hasLiked = lecture.likes.includes(userId);

    if (hasLiked) {
      // Unlike - remove user from lecture likes and lecture from user's liked lectures
      lecture.likes = lecture.likes.filter(likeId => likeId.toString() !== userId);
      user.likedLectures = user.likedLectures.filter(lectureId => lectureId.toString() !== id);
    } else {
      // Like - add user to lecture likes and lecture to user's liked lectures
      lecture.likes.push(userId);
      user.likedLectures.push(id);
    }

    await lecture.save();
    await user.save();

    res.status(200).json({ 
      success: true, 
      liked: !hasLiked,
      likesCount: lecture.likes.length 
    });
  } catch (error) {
    console.error("Error liking lecture:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Save/Update notes for a lecture
app.post("/lectures/:id/notes", authenticateUser, async (req, res) => {
  try {
    const { id: lectureId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    // Find existing note
    const existingNoteIndex = user.notes.findIndex(
      note => note.lectureId.toString() === lectureId
    );

    if (existingNoteIndex > -1) {
      // Update existing note
      user.notes[existingNoteIndex].content = content;
      user.notes[existingNoteIndex].timestamp = new Date();
    } else {
      // Create new note
      user.notes.push({
        lectureId,
        content,
        timestamp: new Date()
      });
    }

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Notes saved successfully",
      note: existingNoteIndex > -1 ? user.notes[existingNoteIndex] : user.notes[user.notes.length - 1]
    });
  } catch (error) {
    console.error("Error saving notes:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Get notes for a lecture
app.get("/lectures/:id/notes", authenticateUser, async (req, res) => {
  try {
    const { id: lectureId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const note = user.notes.find(note => note.lectureId.toString() === lectureId);

    res.status(200).json({ 
      success: true, 
      note: note || null
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Add comment to lecture
app.post("/lectures/:id/comments", authenticateUser, async (req, res) => {
  try {
    const { id: lectureId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Comment content is required" });
    }

    const comment = new Comment({
      lectureId,
      userId,
      content: content.trim()
    });

    await comment.save();
    await comment.populate('userId', 'fullName photo_url');

    res.status(201).json({ 
      success: true, 
      message: "Comment added successfully",
      comment
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Get comments for a lecture
app.get("/lectures/:id/comments", async (req, res) => {
  try {
    const { id: lectureId } = req.params;

    const comments = await Comment.find({ lectureId })
      .populate('userId', 'fullName photo_url')
      .populate('replies.userId', 'fullName photo_url')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      comments
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Delete comment
app.delete("/comments/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Admin Stats API
app.get("/admin/stats", authenticateUser, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const totalCourses = await Course.countDocuments();
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalLectures = await Lecture.countDocuments();
    
    // Calculate total revenue - properly handle Price field
    const courses = await Course.find();
    const totalRevenue = courses.reduce((sum, course) => {
      const price = parseFloat(course.Price) || 0;
      const enrolledCount = course.enrolledStudents?.length || 0;
      return sum + (price * enrolledCount);
    }, 0);

    // Get recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).countDocuments();

    // Top courses by enrollment
    const topCourses = await Course.find()
      .sort({ enrolledStudents: -1 })
      .limit(5)
      .select('title enrolledStudents Price category');

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalUsers,
        totalLectures,
        totalRevenue,
        recentUsers,
        topCourses
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Get course analytics
app.get("/admin/course/:id/analytics", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const course = await Course.findById(id)
      .populate('enrolledStudents', 'fullName email photo_url createdAt')
      .populate('lectures');

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Get completion stats
    const completionStats = await Promise.all(
      course.enrolledStudents.map(async (student) => {
        const user = await User.findById(student._id);
        const completedCount = course.lectures.filter(lecture =>
          user.completedLectures.includes(lecture._id)
        ).length;
        const progress = course.lectures.length > 0 
          ? Math.round((completedCount / course.lectures.length) * 100) 
          : 0;

        return {
          studentId: student._id,
          studentName: student.fullName,
          studentEmail: student.email,
          studentPhoto: student.photo_url,
          enrolledDate: student.createdAt,
          progress,
          completedLectures: completedCount,
          totalLectures: course.lectures.length,
          isCompleted: progress === 100
        };
      })
    );

    const revenue = course.Price * course.enrolledStudents.length;
    const completedStudents = completionStats.filter(s => s.isCompleted).length;
    const averageProgress = completionStats.length > 0
      ? Math.round(completionStats.reduce((sum, s) => sum + s.progress, 0) / completionStats.length)
      : 0;

    res.status(200).json({
      success: true,
      analytics: {
        course: {
          id: course._id,
          title: course.title,
          category: course.category,
          price: course.Price,
          thumbnail: course.thumbnail,
          totalLectures: course.lectures.length
        },
        stats: {
          totalEnrolled: course.enrolledStudents.length,
          completedStudents,
          revenue,
          averageProgress
        },
        students: completionStats
      }
    });
  } catch (error) {
    console.error("Error fetching course analytics:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Delete course
app.delete("/admin/course/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Delete all lectures associated with this course
    await Lecture.deleteMany({ courseId: id });

    // Delete all comments for lectures in this course
    const lectures = await Lecture.find({ courseId: id });
    const lectureIds = lectures.map(l => l._id);
    await Comment.deleteMany({ lectureId: { $in: lectureIds } });

    // Remove course from users' enrolled courses
    await User.updateMany(
      { enrolledCourses: id },
      { $pull: { enrolledCourses: id } }
    );

    // Delete the course
    await Course.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Course and all associated data deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Delete lecture
app.delete("/admin/lecture/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const lecture = await Lecture.findById(id);

    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    // Remove lecture from course
    await Course.findByIdAndUpdate(
      lecture.courseId,
      { $pull: { lectures: id } }
    );

    // Delete comments for this lecture
    await Comment.deleteMany({ lectureId: id });

    // Remove from users' completed lectures
    await User.updateMany(
      { completedLectures: id },
      { $pull: { completedLectures: id } }
    );

    // Remove from users' notes
    await User.updateMany(
      { "notes.lectureId": id },
      { $pull: { notes: { lectureId: id } } }
    );

    // Delete the lecture
    await Lecture.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Lecture deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Get enrollment trends (for charts)
app.get("/admin/enrollment-trends", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Get enrollments for last 12 months
    const trends = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await User.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      trends.push({
        month: startOfMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        enrollments: count
      });
    }

    res.status(200).json({ success: true, trends });
  } catch (error) {
    console.error("Error fetching enrollment trends:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


//jjj