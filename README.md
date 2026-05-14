# 📋 Syed Mujtoba Ali Hall - Complaint Management System

A modern, professional web-based complaint management system for Syed Mujtoba Ali Hall, enabling students to file complaints and allowing administrators to manage and resolve them efficiently.

## 🌟 Features

### Student Portal
- ✅ Easy registration and login with 10-digit registration number
- ✅ File complaints in multiple categories (Electricity, WiFi, Food, Maintenance, Security, Water Supply, Noise, Other)
- ✅ Real-time complaint status tracking
- ✅ View complaint history and details
- ✅ Receive direct communication from administrators
- ✅ Priority levels for complaints

### Admin Portal
- ✅ View all complaints from students
- ✅ Filter complaints by status (Pending, Solving, Solved)
- ✅ Update complaint status
- ✅ Send direct messages to students
- ✅ Dashboard with complaint statistics
- ✅ Search and filter functionality

### Design
- ✅ Professional, responsive design
- ✅ Beautiful UI with modern CSS styling
- ✅ Mobile-friendly interface
- ✅ Intuitive navigation and user experience

## 📁 Project Structure

```
hall_system/
├── frontend/
│   ├── index.html              # Homepage
│   ├── css/
│   │   └── style.css           # Professional styling
│   ├── js/
│   │   ├── student.js          # Student JavaScript
│   │   └── admin.js            # Admin JavaScript
│   ├── student/
│   │   ├── register.html       # Student registration
│   │   ├── login.html          # Student login
│   │   ├── dashboard.html      # Student dashboard
│   │   └── complaint-details.html # Complaint details
│   ├── admin/
│   │   ├── login.html          # Admin login
│   │   └── dashboard.html      # Admin dashboard
│   ├── pages/
│   │   └── about.html          # About page with copyright
│   └── image/
│       └── smah.jpeg           # Hall image
├── backend/
│   ├── server.js               # Express server
│   ├── package.json            # Dependencies
│   ├── config/
│   │   └── db.js               # Database configuration
│   └── routes/
│       ├── studentRoutes.js    # Student API routes
│       ├── complaintRoutes.js  # Complaint API routes
│       └── adminRoutes.js      # Admin API routes
├── database.sql                # Database schema
└── README.md                   # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- A modern web browser

### 1. Database Setup

1. Open MySQL and create the database:
```bash
mysql -u root -p < database.sql
```

Or manually run the SQL commands from `database.sql` file in MySQL Workbench.

2. Verify that the following tables are created:
   - `students`
   - `admin`
   - `categories`
   - `complaints`
   - `messages`

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional) if needed for configuration.

4. Start the server:
```bash
node server.js
```

You should see: `✅ Server running on http://localhost:5000`

### 3. Frontend Setup

1. The frontend files are in the `frontend` directory.

2. You can serve them using any HTTP server. For example, using Python:
```bash
cd frontend
python -m http.server 8000
```

Or use VS Code's Live Server extension.

3. Open your browser and go to:
```
http://localhost:8000
```

## 🔑 Default Admin Credentials

- **Admin ID:** `admin@smh`
- **Password:** `admin123`

**Note:** Change these credentials after first login for security.

## 📊 API Endpoints

### Student Routes
- `POST /student/register` - Register new student
- `POST /student/login` - Login student

### Complaint Routes
- `POST /complaint/add` - File new complaint
- `GET /complaint/all` - Get all complaints (admin)
- `GET /complaint/student/:id` - Get student's complaints
- `GET /complaint/details/:id` - Get complaint details with messages
- `PUT /complaint/status/:id` - Update complaint status
- `POST /complaint/message/:id` - Add message to complaint
- `GET /complaint/categories/list/all` - Get all categories

### Admin Routes
- `POST /admin/login` - Admin login

## 🎓 Complaint Categories

The system supports the following complaint categories:
1. ⚡ Electricity
2. 📡 WiFi
3. 🍽️ Food
4. 🔧 Maintenance
5. 🔒 Security
6. 💧 Water Supply
7. 🔊 Noise
8. ❓ Other

## 🔐 Security Notes

- All credentials are stored in the database
- Use HTTPS in production
- Hash passwords before storing in production
- Validate all inputs on both frontend and backend
- Consider implementing JWT for authentication

## 📱 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🚀 Running the Complete System

1. **Start MySQL Server** (if not running)

2. **Terminal 1 - Backend:**
```bash
cd backend
npm install
node server.js
```

3. **Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 8000
# or use any HTTP server
```

4. **Open Browser:**
```
http://localhost:8000
```

## 📞 Contact & Support

- **Hall Email:** smh@university.edu
- **Phone:** +880 XX-XXXX-XXX
- **Website Owner & Creator:** Mithu Sarkar

## 📄 License

This project is the property of Syed Mujtoba Ali Hall.

---

**Last Updated:** 2026-05-13
**Version:** 1.0
**Creator:** Mithu Sarkar
