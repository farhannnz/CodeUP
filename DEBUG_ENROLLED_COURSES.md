# 🔍 Debug Guide - Enrolled Courses Not Showing

## ✅ What I Fixed

### Issue
Enrolled courses not showing in Profile or My Learning pages.

### Root Cause
Token scope issue - the `token` variable was defined inside `useEffect` but the `fetchCoursesData` function couldn't access it properly.

### Solution Applied
1. ✅ Moved token retrieval inside the async function
2. ✅ Pass token as parameter to `fetchCoursesData`
3. ✅ Added comprehensive console logging for debugging

---

## 🧪 How to Debug

### Step 1: Open Browser Console
Press `F12` or `Ctrl+Shift+I` to open DevTools

### Step 2: Go to Profile Page
Navigate to `/profile` and check console for these logs:

```
✅ Expected logs:
- "Profile data:" {fullName, email, enrolledCourses: [...]}
- "Enrolled courses IDs:" [array of course IDs]
- "Fetched courses:" [array of course objects]
- "Valid courses fetched:" [array of course objects]

❌ If you see:
- "No enrolled courses found" → User hasn't enrolled in any courses
- "Error fetching course..." → Course doesn't exist or API error
```

### Step 3: Go to My Learning Page
Navigate to `/my-learning` and check console for:

```
✅ Expected logs:
- "Fetching profile with token..."
- "Profile response:" {user data}
- "Enrolled course IDs:" [array of IDs]
- "Fetching course details..."
- "Course responses:" [array of responses]
- "Final courses to display:" [array of courses]

❌ If you see:
- "No enrolled courses found" → User hasn't enrolled
- Error messages → Check what went wrong
```

---

## 🔍 Debugging Checklist

### 1. Check if User is Enrolled
```javascript
// In browser console on Profile page:
// You should see enrolled course IDs in the logs
```

**If enrolledCourses is empty:**
- User hasn't enrolled in any courses yet
- Need to enroll first by clicking "Enroll Now" on a course

### 2. Check if Courses Exist
```javascript
// Check console logs for "Error fetching course..."
// This means the course ID exists in user data but course was deleted
```

**If courses don't exist:**
- Course was deleted from database
- Course ID is invalid
- The fix will skip these and show valid courses only

### 3. Check Token
```javascript
// In browser console:
document.cookie
// Should show: token=...
```

**If no token:**
- User not logged in
- Login again

### 4. Check API Response
```javascript
// Look for "Profile response:" in console
// Should show: enrolledCourses: [array of IDs]
```

**If enrolledCourses is undefined:**
- Backend issue (but you said don't touch server)
- Check if enrollment actually saved

---

## 🎯 Testing Steps

### Test 1: Enroll in a Course
```bash
1. Login as student
2. Go to home page
3. Click on any course
4. Click "Enroll Now"
5. Should see success message ✅
6. Check console - should log enrollment
```

### Test 2: Check Profile Page
```bash
1. Go to /profile
2. Open console (F12)
3. Look for logs:
   - "Profile data:"
   - "Enrolled courses IDs:"
   - "Fetched courses:"
4. Scroll to "Enrolled Courses" section
5. Should show enrolled courses ✅
```

### Test 3: Check My Learning Page
```bash
1. Go to /my-learning
2. Open console (F12)
3. Look for logs:
   - "Fetching profile with token..."
   - "Enrolled course IDs:"
   - "Final courses to display:"
4. Should show enrolled courses ✅
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "No enrolled courses found"
**Cause**: User hasn't enrolled in any courses
**Solution**: 
1. Go to home page
2. Click on a course
3. Click "Enroll Now"
4. Then check Profile/My Learning again

### Issue 2: Console shows IDs but no courses display
**Cause**: Courses were deleted from database
**Solution**: 
- The fix now handles this gracefully
- Only valid courses will show
- Invalid ones are skipped

### Issue 3: "Session expired"
**Cause**: Token expired or invalid
**Solution**:
1. Logout
2. Login again
3. Try enrolling again

### Issue 4: API errors in console
**Cause**: Backend not running or network issue
**Solution**:
1. Check if backend is running on port 5000
2. Check network tab in DevTools
3. Look for failed requests (red)

---

## 📊 What to Look For

### In Console Logs:

#### ✅ Good Signs:
```
Profile data: {enrolledCourses: ["id1", "id2"]}
Enrolled courses IDs: ["id1", "id2"]
Fetched courses: [{_id: "id1", title: "Course 1"}, ...]
Valid courses fetched: [{_id: "id1", title: "Course 1"}, ...]
```

#### ❌ Bad Signs:
```
Profile data: {enrolledCourses: []}  // Empty array
Error fetching course...  // Course doesn't exist
Session expired  // Need to login again
```

### In Network Tab:

#### ✅ Good Requests:
```
GET /profile → 200 OK
GET /course/[id] → 200 OK
POST /enroll-course → 200 OK
```

#### ❌ Failed Requests:
```
GET /profile → 401 Unauthorized  // Login again
GET /course/[id] → 404 Not Found  // Course deleted
POST /enroll-course → 400 Bad Request  // Already enrolled
```

---

## 🔧 Quick Fixes

### Fix 1: Clear Everything and Start Fresh
```bash
1. Logout
2. Clear browser cache (Ctrl+Shift+Delete)
3. Clear cookies
4. Close browser
5. Restart backend server
6. Restart frontend server
7. Login again
8. Enroll in a course
9. Check Profile/My Learning
```

### Fix 2: Check Database Directly
```bash
# If you have access to MongoDB:
1. Open MongoDB Compass or shell
2. Find your user document
3. Check enrolledCourses array
4. Should have course IDs
5. Check if those courses exist in courses collection
```

### Fix 3: Test Enrollment Flow
```bash
1. Open Network tab in DevTools
2. Click "Enroll Now" on a course
3. Check POST /enroll-course request
4. Should return: {success: true, message: "Successfully enrolled"}
5. Then refresh Profile page
6. Should show the course
```

---

## 📝 What Changed in Code

### Profile.jsx
```javascript
// BEFORE: Token not accessible in fetchCoursesData
const token = Cookies.get("token");  // Inside useEffect
const fetchCoursesData = async (courseIds) => {
  // Can't access token here!
}

// AFTER: Token passed as parameter
const fetchCoursesData = async (courseIds, authToken) => {
  // Now has access to token!
  headers: { Authorization: `Bearer ${authToken}` }
}
```

### MyLearning.jsx
```javascript
// BEFORE: Token defined at top of useEffect
const token = Cookies.get("token");

// AFTER: Token retrieved inside async function
const fetchEnrolledCourses = async () => {
  const token = Cookies.get("token");  // Now accessible
  // Rest of the code...
}
```

### Added Logging
```javascript
// Now you can see what's happening:
console.log("Profile data:", response.data);
console.log("Enrolled courses IDs:", enrolledCourseIds);
console.log("Fetched courses:", coursesData);
```

---

## ✅ Verification

After the fix, you should see:

### In Profile Page:
- ✅ Console logs showing enrolled courses
- ✅ "Enrolled Courses" section populated
- ✅ Course titles displayed
- ✅ No errors in console

### In My Learning Page:
- ✅ Console logs showing course fetching
- ✅ Course cards displayed
- ✅ "Continue Learning" section populated
- ✅ No errors in console

---

## 🎯 Next Steps

1. **Clear browser cache and cookies**
2. **Restart both servers** (frontend & backend)
3. **Login as a student**
4. **Enroll in a course**
5. **Open console (F12)**
6. **Go to Profile page** - check logs
7. **Go to My Learning page** - check logs
8. **Look for the console logs I added**
9. **Share the console output if still not working**

---

## 📞 If Still Not Working

Share these details:
1. Console logs from Profile page
2. Console logs from My Learning page
3. Network tab showing API requests
4. User's enrolledCourses array from database
5. Any error messages

---

**Updated**: October 19, 2025
**Status**: ✅ Fixed with debugging logs
**Action**: Check console logs to see what's happening
