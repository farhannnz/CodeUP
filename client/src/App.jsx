import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/ui/navbar';
import Hero from './components/ui/Hero';
import Login from './pages/Login';
import CourseList from './components/ui/CourseList';
import MyLearning from './components/ui/MyLearning';
import Profile from './components/ui/Profile';
import CreateCourse from './components/ui/CreateCourse';
import AdminDashboard from './components/ui/AdminDashboard';
import EditCourse from './components/ui/EditCourse';
import ViewCourse from './components/ui/ViewCourse';
import AddLecture from './components/ui/AddLecture';
import WatchLecture from './components/ui/WatchLecture';  // ✅ Fixed

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<><Hero /><CourseList/></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-learning" element={<MyLearning />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/create-course" element={<CreateCourse />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/edit-course/:id" element={<EditCourse />} />
        <Route path="/course/:id" element={<ViewCourse />} />
        <Route path="/add-lecture/:Courseid" element={<AddLecture />} />
        <Route path="/watch-lecture/:lectureId" element={<WatchLecture />} />  {/* ✅ Route fix */}
      </Routes>
    </>
  );
}

export default App;
