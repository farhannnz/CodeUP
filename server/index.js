const express = require("express");
const dotenv = require("dotenv");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const connectDB = require("./database/dbConnect");
const User = require("./models/userModel");
const Course = require("./models/courseModel");
const cors = require("cors");
const Lecture = require("./models/lectureModel");
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

  console.log("Authenticated user:", req.user);  // Log to check if req.user is populated
  console.log("Received data:", fullName, email, photo_url);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // req.user._id should be populated by authenticateUser middleware
      { fullName, email, photo_url },
      { new: true } // This returns the updated user object
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Error updating profile");
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
app.post("/create-course",authenticateUser, async (req,res)=>{
  try{
    const {title,category}= req.body;
    if(!title || !category){
      return express.res.status(400).json({
             message:"All fields are required"
      })
    }
    const course = await Course.create({
      title,
      category
    })
    return express.res.status(201).json({
      course,
      message:"course created"
    })
  }
  catch(err){
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
    const { lectureTitle, videoUrl } = req.body;
    const { id: courseId } = req.params;  // Extract courseId from URL parameters

    if (!lectureTitle || !videoUrl) {
      return res.status(400).json({ message: "Lecture title and video URL are required" });
    }

    // Create a new lecture and include courseId
    const lecture = new Lecture({
      lectureTitle,
      videoUrl,
      courseId,  // Attach the courseId to the lecture document
    });

    // Save the lecture to the database
    await lecture.save();

    // Find the course and add the lecture to the lectures array
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Push the lecture into the course's lectures array
    course.lectures.push(lecture._id);
    await course.save();

    res.status(201).json({
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
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


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
