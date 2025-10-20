# 🚀 CodeUP - Next-Gen Learning Platform

<div align="center">

![CodeUP Banner](https://img.shields.io/badge/CodeUP-Learning%20Platform-0EA5E9?style=for-the-badge&logo=rocket&logoColor=white)

**Empowering learners worldwide with cutting-edge courses and AI-powered education**

[![Live Demo](https://img.shields.io/badge/Live-Demo-10B981?style=for-the-badge&logo=vercel)](https://codeup-1-7y5p.onrender.com)
[![Backend API](https://img.shields.io/badge/API-Live-A855F7?style=for-the-badge&logo=fastapi)](https://codeup-ql59.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-EC4899?style=for-the-badge)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Screenshots](#-screenshots) • [API Docs](#-api-documentation)

</div>

---

## 🌟 Overview

**CodeUP** is a modern, full-stack learning management system (LMS) built with the MERN stack. It features a stunning tech-inspired UI, real-time progress tracking, interactive video lectures, and a comprehensive admin dashboard with analytics.

### ✨ What Makes CodeUP Special?

- 🎨 **Stunning UI/UX** - Modern, responsive design with glassmorphism and gradient effects
- 📊 **Real-time Analytics** - Track student progress, course performance, and revenue
- 🎓 **Interactive Learning** - Video lectures with notes, comments, and progress tracking
- 🏆 **Certificates** - Auto-generated certificates upon course completion
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

---

## 🎯 Features

### 👨‍🎓 For Students

- ✅ Browse and enroll in courses
- ✅ Watch video lectures with progress tracking
- ✅ Take notes while learning
- ✅ Comment and discuss on lectures
- ✅ Like lectures and provide feedback
- ✅ Track learning progress with visual indicators
- ✅ Earn certificates upon course completion
- ✅ View all enrolled courses in one place
- ✅ Personalized profile with learning stats

### 👨‍💼 For Instructors/Admins

- ✅ Create and manage courses
- ✅ Add lectures with video URLs and resources
- ✅ Edit course details and content
- ✅ Delete courses and lectures
- ✅ View detailed course analytics
- ✅ Track student enrollment and progress
- ✅ Monitor revenue and performance metrics
- ✅ See completion rates and engagement
- ✅ Access comprehensive admin dashboard
- ✅ View enrollment trends with charts

### 🎨 UI/UX Features

- ✅ Modern tech-inspired design
- ✅ Glassmorphism effects
- ✅ Smooth animations and transitions
- ✅ Gradient color schemes
- ✅ Dark mode optimized
- ✅ Responsive on all devices
- ✅ Interactive charts and graphs
- ✅ Loading states and error handling

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat-square&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?style=flat-square&logo=react-router&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F56565?style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=flat-square&logo=framer&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.x-880000?style=flat-square)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens&logoColor=white)

### DevOps & Tools
![Render](https://img.shields.io/badge/Render-Hosting-46E3B7?style=flat-square&logo=render&logoColor=white)
![Git](https://img.shields.io/badge/Git-Version_Control-F05032?style=flat-square&logo=git&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-Editor-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white)

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/farhannnz/CodeUP.git
cd CodeUP
```

### 2️⃣ Setup Backend

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
EOF

# Start server
npm start
# or for development
npm run dev
```

### 3️⃣ Setup Frontend

```bash
cd ../client
npm install

# Start development server
npm run dev
```

### 4️⃣ Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 🎨 Screenshots

### 🏠 Home Page
Modern landing page with animated hero section and course catalog.

### 📚 Course Details
Comprehensive course view with curriculum, reviews, and enrollment options.

### 🎥 Video Player
Interactive lecture player with notes, comments, and progress tracking.

### 📊 Admin Dashboard
Real-time analytics with charts, stats, and course management.

### 👤 User Profile
Personalized dashboard showing enrolled courses and learning progress.

### 🏆 Certificate
Auto-generated certificates for completed courses.

---

## 📡 API Documentation

### Authentication Endpoints

```http
POST /register          # Register new user
POST /login            # Login user
POST /logout           # Logout user
GET  /profile          # Get user profile
PUT  /edit-profile     # Update profile
```

### Course Endpoints

```http
GET    /courses                    # Get all courses
POST   /create-course              # Create course (Admin)
GET    /view-courses/:id           # Get course details
PUT    /courses/:id                # Update course (Admin)
DELETE /admin/course/:id           # Delete course (Admin)
POST   /enroll-course              # Enroll in course
```

### Lecture Endpoints

```http
POST   /add-lecture/:id            # Add lecture (Admin)
GET    /lectures/:id               # Get lecture details
PUT    /lectures/:id               # Update lecture (Admin)
DELETE /admin/lecture/:id          # Delete lecture (Admin)
POST   /lectures/:id/like          # Like/unlike lecture
```

### Progress & Notes

```http
POST /complete-lecture             # Mark lecture complete
GET  /course-progress/:id          # Get course progress
POST /lectures/:id/notes           # Save notes
GET  /lectures/:id/notes           # Get notes
```

### Comments

```http
POST   /lectures/:id/comments      # Add comment
GET    /lectures/:id/comments      # Get comments
DELETE /comments/:id               # Delete comment
```

### Admin Analytics

```http
GET /admin/stats                   # Dashboard statistics
GET /admin/course/:id/analytics    # Course analytics
GET /admin/enrollment-trends       # Enrollment trends
```

### Certificates

```http
GET /generate-certificate/:id      # Generate certificate
```

---

## 🗂️ Project Structure

```
CodeUP/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   └── ui/       # UI components
│   │   ├── pages/        # Page components
│   │   ├── config/       # Configuration files
│   │   ├── App.jsx       # Main App component
│   │   └── App.css       # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB models
│   │   ├── userModel.js
│   │   ├── courseModel.js
│   │   ├── lectureModel.js
│   │   └── commentModel.js
│   ├── database/         # Database connection
│   ├── index.js          # Main server file
│   └── package.json
│
├── render.yaml           # Render deployment config
└── README.md            # This file
```

---

## 🚀 Deployment

### Deploy to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Configure Render**
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`
   - Set environment variables in Render dashboard
   - Deploy!

### Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/codeup
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=production
```

---

## 🎯 Key Features Explained

### 🔐 Authentication System
- JWT-based authentication
- Secure password hashing with crypto
- Role-based access (Student/Admin)
- Token blacklisting for logout

### 📊 Progress Tracking
- Real-time lecture completion tracking
- Course progress percentage
- Visual progress indicators
- Persistent across sessions

### 🎓 Certificate Generation
- Auto-generated upon 100% completion
- Unique certificate IDs
- Downloadable/printable format
- Includes course and student details

### 💬 Interactive Features
- Lecture comments with replies
- Like system for lectures
- Personal notes per lecture
- Discussion threads

### 📈 Admin Analytics
- Real-time dashboard statistics
- Course performance metrics
- Student enrollment trends
- Revenue tracking
- Completion rate analysis

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Farhan**

- GitHub: [@farhannnz](https://github.com/farhannnz)
- Project Link: [https://github.com/farhannnz/CodeUP](https://github.com/farhannnz/CodeUP)

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Inspiration from modern EdTech platforms

---

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Contact via email
- Check the documentation

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ and ☕ by Farhan**

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=farhannnz.CodeUP)
![GitHub Stars](https://img.shields.io/github/stars/farhannnz/CodeUP?style=social)
![GitHub Forks](https://img.shields.io/github/forks/farhannnz/CodeUP?style=social)

</div>
