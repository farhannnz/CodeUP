# 🔧 Troubleshooting Guide - CodeUP

Quick solutions to common issues you might encounter.

---

## 🚨 COMMON ERRORS & SOLUTIONS

### 1. "styled is not defined" ✅ FIXED
**Status**: Already fixed in Profile.jsx
**If you still see it**: Clear browser cache and restart dev server

### 2. "Cannot find module 'bcryptjs'"
```bash
cd server
npm install bcryptjs
```

### 3. "Cannot find module 'styled-components'"
```bash
cd client
npm install styled-components
```

### 4. "MongooseError: Connection failed"
**Solutions**:
- Check if MongoDB is running
- Verify MONGO_URL in `.env` file
- Check internet connection (if using MongoDB Atlas)

### 5. "JWT malformed" or "Invalid token"
**Solutions**:
- Clear cookies in browser
- Login again
- Check JWT_SECRET in `.env` file

### 6. "Cannot POST /api/..."
**Solutions**:
- Make sure backend server is running
- Check if port 5000 is available
- Verify API URL in frontend code

---

## 🔍 DEBUGGING STEPS

### Step 1: Check Console
Open browser DevTools (F12) and look for:
- Red errors
- Yellow warnings
- Network failures

### Step 2: Check Network Tab
Look for:
- Failed API calls (red)
- 401 errors (authentication)
- 500 errors (server issues)

### Step 3: Check Backend Logs
Look in terminal where server is running for:
- Error messages
- Stack traces
- Connection issues

---

## 💻 ENVIRONMENT ISSUES

### Backend Not Starting
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed (Windows)
taskkill /PID <process_id> /F

# Restart server
npm run dev
```

### Frontend Not Starting
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database Connection Issues
```bash
# Test MongoDB connection
# In MongoDB shell:
mongosh "your_connection_string"

# Or check MongoDB Atlas dashboard
```

---

## 🔐 AUTHENTICATION ISSUES

### Can't Login
**Check**:
1. Is user registered?
2. Is password correct?
3. Check console for errors
4. Verify backend is running

**Solution**:
```javascript
// Register new user first
// Then login with same credentials
```

### Token Expired
**Solution**:
```javascript
// Simply login again
// Token expires after 1 day
```

### "Unauthorized" Error
**Solutions**:
1. Login again
2. Check if token exists in cookies
3. Verify token is being sent in headers

---

## 📝 FORM ISSUES

### Profile Update Not Working
**Check**:
1. Are you logged in?
2. Is email already taken?
3. Check console for errors

**Solution**:
```javascript
// Make sure form has onSubmit={handleSaveChanges}
// Check if e.preventDefault() is called
```

### Course Creation Fails
**Check**:
1. Are you logged in as admin?
2. Are all fields filled?
3. Check backend logs

**Solution**:
```javascript
// Make user admin in database:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🎓 COURSE ISSUES

### My Learning Shows Nothing
**Possible Reasons**:
1. Not enrolled in any courses
2. Backend not returning data
3. Token expired

**Solution**:
```javascript
// Enroll in a course first
// Then check My Learning page
```

### Can't Enroll in Course
**Check**:
1. Are you logged in?
2. Already enrolled?
3. Check console errors

**Solution**:
```javascript
// Login first
// Then try enrolling again
```

---

## 🖼️ UI ISSUES

### Styles Not Loading
**Solutions**:
```bash
# Clear browser cache
Ctrl + Shift + Delete

# Restart dev server
npm run dev

# Check if Tailwind CSS is configured
```

### Images Not Showing
**Check**:
1. Image URL is valid
2. CORS issues
3. Network connection

**Solution**:
```javascript
// Use valid image URLs
// Or upload to image hosting service
```

---

## 🔄 DATA ISSUES

### Old Data Showing
**Solutions**:
```bash
# Clear browser cache
# Hard refresh: Ctrl + Shift + R
# Clear cookies
# Restart browser
```

### Data Not Updating
**Check**:
1. API call successful?
2. Response has success: true?
3. State updating correctly?

**Solution**:
```javascript
// Check Network tab for API response
// Verify state update in React DevTools
```

---

## 🚀 DEPLOYMENT ISSUES

### Build Fails
```bash
# Frontend build
cd client
npm run build

# If fails, check for:
# - Syntax errors
# - Missing dependencies
# - Environment variables
```

### Server Crashes
**Check**:
1. Environment variables set?
2. MongoDB connection working?
3. Port available?

**Solution**:
```bash
# Check logs
# Verify .env file
# Test locally first
```

---

## 📊 PERFORMANCE ISSUES

### Slow Loading
**Solutions**:
1. Check internet connection
2. Optimize images
3. Add loading states
4. Use pagination

### High Memory Usage
**Solutions**:
1. Close unused tabs
2. Restart browser
3. Clear cache
4. Check for memory leaks

---

## 🔧 QUICK FIXES

### Reset Everything
```bash
# Backend
cd server
rm -rf node_modules
npm install
npm run dev

# Frontend
cd client
rm -rf node_modules
npm install
npm run dev
```

### Clear All Data
```bash
# Clear browser data
# Clear cookies
# Clear local storage
# Restart browser
```

### Fresh Start
```bash
# 1. Stop all servers
# 2. Clear node_modules
# 3. Clear browser cache
# 4. Reinstall dependencies
# 5. Restart everything
```

---

## 📞 STILL STUCK?

### Checklist:
- [ ] Read error message carefully
- [ ] Check console for errors
- [ ] Check network tab
- [ ] Check backend logs
- [ ] Try solutions above
- [ ] Restart everything
- [ ] Clear cache
- [ ] Reinstall dependencies

### Debug Mode:
```javascript
// Add console.logs
console.log("Data:", data);
console.log("Error:", error);
console.log("Response:", response);

// Check state
console.log("State:", state);

// Check props
console.log("Props:", props);
```

---

## 🎯 PREVENTION TIPS

### Best Practices:
1. ✅ Always check console
2. ✅ Test after each change
3. ✅ Keep dependencies updated
4. ✅ Use version control (Git)
5. ✅ Read error messages
6. ✅ Test in different browsers
7. ✅ Keep backups
8. ✅ Document changes

### Development Workflow:
1. Make small changes
2. Test immediately
3. Check console
4. Commit if working
5. Repeat

---

## 📚 USEFUL COMMANDS

### Backend
```bash
# Start server
npm run dev

# Check dependencies
npm list

# Update dependencies
npm update

# Clear cache
npm cache clean --force
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Check for issues
npm run lint
```

### Database
```bash
# Connect to MongoDB
mongosh "connection_string"

# Show databases
show dbs

# Use database
use codeUP

# Show collections
show collections

# Find users
db.users.find()
```

---

## 🎓 LEARNING RESOURCES

### React
- React DevTools (Chrome Extension)
- React Documentation
- Console.log debugging

### Node.js
- Node.js Documentation
- Express.js Guide
- MongoDB Documentation

### Debugging
- Chrome DevTools
- Network Tab
- Console Tab
- React DevTools

---

## ✅ VERIFICATION

After fixing any issue:
- [ ] Error gone from console?
- [ ] Feature working?
- [ ] No new errors?
- [ ] Tested thoroughly?
- [ ] Documented fix?

---

## 🎉 REMEMBER

- Most issues are simple fixes
- Read error messages carefully
- Google is your friend
- Check documentation
- Ask for help if stuck
- Keep calm and debug!

---

**Last Updated**: October 19, 2025
**Version**: 1.0.0
**Status**: Complete ✅
