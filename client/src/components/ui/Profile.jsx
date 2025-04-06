import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const token = Cookies.get("token");
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    photo_url: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      alert("Login First!");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setEditFormData({
          fullName: response.data.fullName,
          email: response.data.email,
          photo_url: response.data.photo_url || "",
        });

        const coursesData = await fetchCoursesData(response.data.enrolledCourses);
        setEnrolledCourses(coursesData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Session Expired! Please Login Again.");
        Cookies.remove("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchCoursesData = async (courseIds) => {
    try {
      const coursePromises = courseIds.map((courseId) =>
        axios.get(`http://localhost:5000/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      const courseResponses = await Promise.all(coursePromises);
      return courseResponses.map((response) => response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    alert("Logged out successfully!");
    navigate("/login");
  };

  const handleEditClick = () => {
    setIsEditing(true); // Show the edit form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    // Log the data being sent to ensure it's not empty
    console.log("Form data:", editFormData); // Use editFormData to get the latest state
  
    // Check if token exists before sending the request
    if (!token) {
      console.error("Token is missing");
      return;
    }
  
    try {
      // Send PUT request to update user profile
      const response = await axios.put(
        "http://localhost:5000/edit-profile",
        editFormData, // Send the full editFormData
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
            "Content-Type": "application/json", // Ensure content type is JSON
          },
        }
      );
  
      // Log the successful response
      console.log("Profile updated:", response.data);
      // Optionally, show a success message or update UI after success
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      // Optionally, show an error message if there’s an error
    }
  };
  
  

  if (!user) {
    return <div>Loading Profile...</div>;
  }

  return (
    <ProfileContainer>
      <Header>
        <h1>Your Profile</h1>
      </Header>

      <ProfileCard>
        <ProfilePhoto>
          <img
            src={
              user.photo_url ||
              "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?rs=1&pid=ImgDetMain"
            }
            alt="Profile"
          />
          <StatusIndicator />
        </ProfilePhoto>
        <UserName>{user.fullName}</UserName>
        <UserRole>Student</UserRole>
        <UserDetails>
          <Detail>
            <span>Email:</span>
            <span>{user.email}</span>
          </Detail>
        </UserDetails>

        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        <EditButton onClick={handleEditClick}>Edit Profile</EditButton>
      </ProfileCard>

      {/* Edit Profile Form */}
      {isEditing && (
        <EditProfileForm onSubmit={handleSaveChanges}>
          <InputField>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={editFormData.fullName}
              onChange={handleChange}
            />
          </InputField>

          <InputField>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editFormData.email}
              onChange={handleChange}
            />
          </InputField>

          <InputField>
            <label htmlFor="photo_url">Profile Picture URL</label>
            <input
              type="text"
              id="photo_url"
              name="photo_url"
              value={editFormData.photo_url}
              onChange={handleChange}
            />
          </InputField>

          <SaveButton type="submit">Save Changes</SaveButton>
        </EditProfileForm>
      )}

      <EnrolledCoursesSection>
        <h3>Enrolled Courses</h3>
        <CourseList>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course, index) => (
              <CourseItem key={index}>{course.title}</CourseItem>
            ))
          ) : (
            <CourseItem>No enrolled courses found.</CourseItem>
          )}
        </CourseList>
      </EnrolledCoursesSection>
    </ProfileContainer>
  );
};

// Styled-Components

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #1f2937;
`;

const Header = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: bold;
    background: linear-gradient(90deg, #6a11cb, #2575fc);
    -webkit-background-clip: text;
    color: transparent;
    text-align: center;
    position: relative;
  }
`;

const ProfileCard = styled.div`
  background-color: #2d3748;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ProfilePhoto = styled.div`
  position: relative;
  margin-bottom: 20px;
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #4caf50;
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 50%;
`;

const UserName = styled.h2`
  font-size: 24px;
  font-weight: 600;
`;

const UserRole = styled.p`
  font-size: 14px;
  color: #4caf50;
  margin-bottom: 20px;
`;

const UserDetails = styled.div`
  margin-top: 20px;
  font-size: 14px;
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const LogoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #4caf50, #388e3c);
  color: white;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: linear-gradient(135deg, #388e3c, #4caf50);
  }
`;

const EditButton = styled.button`
  width: 100%;
  background-color: #fbd38d;
  color: white;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: #ed8936;
  }
`;

const EditProfileForm = styled.form`
  background-color: #2d3748;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
`;

const InputField = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-size: 14px;
    color: #fff;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  background-color: #68d391;
  color: white;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #38a169;
  }
`;

const EnrolledCoursesSection = styled.div`
  margin-top: 40px;
  width: 100%;
  max-width: 500px;
`;

const CourseList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CourseItem = styled.li`
  background-color: #2d3748;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  color: white;
  font-size: 16px;
`;

export default Profile;
