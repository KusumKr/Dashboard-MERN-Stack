# MERN Stack Dashboard Application

A full-stack application built with MongoDB, Express, React, and Node.js featuring authentication, role-based access control, and CRUD operations.

## Features

- ✅ User Authentication (Sign Up & Login)
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Admin & Student)
- ✅ Admin Dashboard with full CRUD operations
- ✅ Student Dashboard with profile management
- ✅ Protected routes
- ✅ Context API for state management
- ✅ Logout functionality

## Project Structure

```
dashboard/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── students.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or **MongoDB Atlas - Recommended**)
- npm or yarn

> ⭐ **For Testing/Demo**: Use **MongoDB Atlas** (cloud) to avoid local setup and connection errors. See `MONGODB_ATLAS_SETUP.md` for detailed instructions.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dashboard
JWT_SECRET=your_jwt_secret_key_here
```

   **For MongoDB Atlas (Recommended):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dashboard?retryWrites=true&w=majority
   ```
   See `MONGODB_ATLAS_SETUP.md` for complete setup instructions.

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Creating an Admin User

By default, signup creates a student user. To create an admin user, you can use the provided script:

```bash
cd backend
npm run create-admin [email] [password] [name]
```

Example:
```bash
npm run create-admin admin@example.com admin123 "Admin User"
```

If no arguments are provided, it will create a default admin:
- Email: admin@example.com
- Password: admin123
- Name: Admin User

Alternatively, you can manually update a user in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### User Roles

- **Admin**: Can view all students, add/edit/delete student records
- **Student**: Can view and update only their own profile

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

#### Students (Protected)
- `GET /api/students` - Get all students (Admin only)
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/profile/me` - Get own profile (Student only)
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student (Admin only)

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, React Router, Context API, Axios
- **Authentication**: JWT, bcrypt
- **Styling**: CSS3

## Notes

- Make sure MongoDB is running before starting the backend
- The JWT secret should be changed in production
- Student profiles are separate from user accounts - admins need to create student records
- Students can only view/update their own profile based on email matching

