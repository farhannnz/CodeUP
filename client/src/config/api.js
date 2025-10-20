// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://codeup-ql59.onrender.com/";

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/register`,
  LOGIN: `${API_BASE_URL}/login`,
  LOGOUT: `${API_BASE_URL}/logout`,
  PROFILE: `${API_BASE_URL}/profile`,
  EDIT_PROFILE: `${API_BASE_URL}/edit-profile`,

  // Courses
  COURSES: `${API_BASE_URL}/courses`,
  CREATE_COURSE: `${API_BASE_URL}/create-course`,
  VIEW_COURSE: (id) => `${API_BASE_URL}/view-courses/${id}`,
  COURSE: (id) => `${API_BASE_URL}/course/${id}`,
  EDIT_COURSE: (id) => `${API_BASE_URL}/courses/${id}`,

  // Lectures
  ADD_LECTURE: (id) => `${API_BASE_URL}/add-lecture/${id}`,
  LECTURE: (id) => `${API_BASE_URL}/lectures/${id}`,

  // Enrollment
  ENROLL_COURSE: `${API_BASE_URL}/enroll-course`,
};

export default API_BASE_URL;
