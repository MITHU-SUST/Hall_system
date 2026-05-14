# 🚀 Quick Start Guide

## Project Overview
Syed Mujtoba Ali Hall Complaint Management System - A complete, professional web application for managing student complaints.

## ⚡ Quick Setup (5 minutes)

### Step 1: Database Setup
```bash
# Open MySQL and run:
mysql -u root -p < database.sql
```

### Step 2: Backend
```bash
cd backend
npm install
node server.js
# Should show: ✅ Server running on http://localhost:5000
```

### Step 3: Frontend
```bash
cd frontend
# Using Python 3:
python -m http.server 8000
# Or using any other HTTP server
```

### Step 4: Access
```
Student: http://localhost:8000
Admin: http://localhost:8000/admin/login.html
```

## 📝 Test Accounts

### Student
- **Registration Number:** 2021100001
- **Name:** Ahmed Ali
- **Room:** 301

### Admin
- **Admin ID:** admin@smh
- **Password:** admin123

## 🎯 User Flow

### For Students:
1. **Register/Login** → Enter 10-digit registration number
2. **File Complaint** → Select category, add details
3. **Track Status** → View complaint status in real-time
4. **Receive Updates** → Get messages from admin
5. **View History** → See all past complaints

### For Admins:
1. **Login** → Admin dashboard
2. **View Complaints** → See all filed complaints
3. **Update Status** → Mark as pending/solving/solved
4. **Send Messages** → Communicate with students
5. **Filter & Search** → Organize by status or category

## 📱 Key Features

✅ **Student Portal**
- Registration with 10-digit reg number
- File complaints by category
- Real-time status tracking
- Message history with admin
- Complaint history

✅ **Admin Portal**
- Dashboard with statistics
- Filter by status
- Update complaint status
- Send messages to students
- Search functionality

✅ **Professional Design**
- Responsive layout
- Modern CSS
- Smooth animations
- Mobile-friendly
- Clean UI/UX

## 🔧 Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **API:** RESTful

## 📂 File Structure

```
hall_system/
├── frontend/
│   ├── index.html                    (Homepage)
│   ├── css/style.css                 (Professional styling)
│   ├── js/
│   │   ├── student.js               (Student functions)
│   │   └── admin.js                 (Admin functions)
│   ├── student/
│   │   ├── register.html            (Student registration)
│   │   ├── login.html               (Student login)
│   │   ├── dashboard.html           (Main dashboard)
│   │   └── complaint-details.html   (View complaint)
│   ├── admin/
│   │   ├── login.html               (Admin login)
│   │   └── dashboard.html           (Admin dashboard)
│   └── pages/
│       └── about.html               (About page with copyright)
│
├── backend/
│   ├── server.js                    (Express server)
│   ├── package.json                 (Dependencies)
│   ├── config/db.js                 (DB config)
│   └── routes/
│       ├── studentRoutes.js         (Student API)
│       ├── complaintRoutes.js       (Complaint API)
│       └── adminRoutes.js           (Admin API)
│
├── database.sql                     (Database schema)
├── README.md                        (Full documentation)
└── QUICKSTART.md                    (This file)
```

## 🔑 API Endpoints

```
Student Routes:
POST /student/register          - Register new student
POST /student/login             - Login student

Complaint Routes:
POST /complaint/add             - File complaint
GET /complaint/all              - Get all complaints (admin)
GET /complaint/student/:id      - Get student's complaints
GET /complaint/details/:id      - Get complaint with messages
PUT /complaint/status/:id       - Update status
POST /complaint/message/:id     - Add message
GET /complaint/categories/list/all - Get categories

Admin Routes:
POST /admin/login               - Admin login
```

## 💬 Complaint Categories

1. ⚡ Electricity
2. 📡 WiFi
3. 🍽️ Food
4. 🔧 Maintenance
5. 🔒 Security
6. 💧 Water Supply
7. 🔊 Noise
8. ❓ Other

## 🎨 Complaint Status

- **Pending** ⏳ - Newly filed, awaiting admin review
- **Solving** 🔧 - Admin is working on the issue
- **Solved** ✅ - Issue has been resolved

## 💡 Tips

1. **Test Different Scenarios:**
   - File complaint as student
   - Login as admin and update status
   - Add messages and track changes

2. **Database:**
   - Check MySQL is running
   - Use `mysql -u root -p` to verify connection
   - Database name: `hall_system`

3. **Troubleshooting:**
   - If port 5000 is in use, change in `server.js`
   - If frontend won't load, check HTTP server is running
   - Clear browser cache if seeing old pages

4. **Security Note:**
   - Change admin password in production
   - Use HTTPS in production
   - Hash passwords in production

## 📞 Support

**Website Owner & Creator:** Mithu Sarkar

For issues or questions, contact:
- **Email:** smh@university.edu
- **Phone:** +880 XX-XXXX-XXX

## ✨ Features Implemented

✅ Professional Homepage
✅ Student Registration & Login
✅ Admin Login & Dashboard
✅ File Complaints by Category
✅ Real-time Status Tracking
✅ Admin Message System
✅ Complaint History
✅ Dashboard Statistics
✅ Search & Filter
✅ Responsive Design
✅ Professional CSS
✅ About Page with Copyright
✅ Complete API Backend
✅ MySQL Database

## 🎉 You're All Set!

Start the backend and frontend, then navigate to `http://localhost:8000` to see your professional complaint management system in action!

---

**Project Version:** 1.0  
**Last Updated:** 2026-05-13  
**Creator:** Mithu Sarkar
