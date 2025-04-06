
# 📚 CodeUP - Learning Management System (LMS)

CodeUP is a full-stack Learning Management System (LMS) built using the **MERN** stack – **MongoDB**, **Express.js**, **React.js**, and **Node.js**.  
It provides an intuitive platform where **admins** can manage courses and lectures, while **users** can seamlessly explore, preview, and watch learning content.

---

## 🔧 Project Structure
CodeUP/
├── client/ # React.js frontend
└── server/ # Node.js + Express backend


---

## 🚀 Features

- 👥 User Authentication (Register/Login)
- 🛠 Admin Panel:
  - ➕ Create / ✏️ Update / ❌ Delete Courses
  - 🎥 Add Lectures with Video Uploads
  - 🔓 Set Free Previews for Lectures
- 📋 Course Listing for Users
- ▶️ Watch Video Lectures
- 📱 Responsive UI for all devices
- 🔐 Protected Routes using JWT
- ☁️ Cloudinary Integration for video uploads

---

## 🛠 Tech Stack

**Frontend:**  
React.js, React Router, Axios, Bootstrap

**Backend:**  
Node.js, Express.js, MongoDB, Mongoose

**Others:**  
Cloudinary, Multer, JWT, dotenv

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CodeUP-LMS.git
cd CodeUP-LMS

---

### 2. Backend Setup (/server)

```bash

cd server
npm install

---

### Create a .env file inside /server:

```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Start the backend server:

```bash
npm run dev

### 3. Frontend Setup (/client)
```bash
cd ../client
npm install
npm start
---

### Open your browser and visit:

🔗 http://localhost:3000
---

### 📁 API Endpoints
Method	Endpoint	Description
GET	/courses	Get all courses
POST	/admin/course	Add new course (Admin only)
POST	/admin/course/:id/lecture	Add lecture to course
GET	/course/:id/lectures	Get all lectures in course
POST	/auth/register	Register a new user
POST	/auth/login	Login and get token
🖼 Screenshots
Add screenshots of your project here (e.g. Home page, Admin dashboard, Course view, Watch lecture etc.)
--- 
📌 Future Enhancements
💳 Payment Integration for Premium Content
❓ Quiz Modules for Each Lecture
📜 Certificate on Course Completion
📈 Student Progress Tracker
💬 Real-time Chat/Comments on Lectures
©️ License
This project is licensed under the MIT License.

👨‍💻 Author
Farhan Pathan

🎓 BCA Semester III | 💻 Full Stack Developer | 🚀 Creator of CodeUP

🔗 Connect With Me
💼 GitHub: https://github.com/farhannnz
📧 Email: krahit57@gmail.com
