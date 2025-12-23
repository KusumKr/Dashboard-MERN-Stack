# Vercel Deployment Guide

## Environment Variables for Vercel

When deploying your MERN Stack Dashboard to Vercel, you need to add environment variables for both **Backend** and **Frontend**.

---

## Backend Environment Variables

### Required Environment Variables

#### 1. `MONGODB_URI`
- **Description**: Your MongoDB Atlas connection string
- **Example**: 
  ```
  mongodb+srv://dashboard-user:user740@cluster0.qcz7g53.mongodb.net/dashboard?retryWrites=true&w=majority&appName=Cluster0
  ```
- **Where to get it**: MongoDB Atlas → Database → Connect → Connect your application
- **Important**: 
  - Replace `dashboard-user` and `user740` with your actual credentials
  - Make sure your IP is whitelisted in MongoDB Atlas (or use `0.0.0.0/0` for testing)

#### 2. `JWT_SECRET`
- **Description**: Secret key for signing and verifying JWT tokens
- **Example**: 
  ```
  your_super_secret_jwt_key_1234567890_abcdefghijklmnopqrstuvwxyz
  ```
- **Important**: 
  - Use a long, random, secure string (at least 32 characters)
  - Never share this secret publicly
  - Use different secrets for development and production

#### 3. `PORT` (Optional)
- **Description**: Server port number
- **Default**: Vercel automatically sets this, so you usually don't need to set it
- **Note**: Vercel will provide the PORT automatically, but you can set it if needed

---

## How to Add Environment Variables in Vercel

### Step 1: Go to Your Project Settings
1. Open your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Add Each Variable
1. Click **Add New**
2. Enter the **Name** (e.g., `MONGODB_URI`)
3. Enter the **Value** (your actual connection string or secret)
4. Select **Environment(s)**:
   - ✅ **Production** (for production deployments)
   - ✅ **Preview** (for preview deployments)
   - ✅ **Development** (for local development with Vercel CLI)
5. Click **Save**

### Step 3: Repeat for All Variables
Add all three variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (optional, usually not needed)

---

## Frontend Environment Variables

### Required Environment Variable

#### `REACT_APP_API_URL`
- **Description**: Your backend API URL (Vercel deployment URL)
- **Example for Production**: 
  ```
  https://your-backend-app.vercel.app/api
  ```
- **Example for Development**: 
  ```
  http://localhost:5000/api
  ```
- **Important**: 
  - Must start with `REACT_APP_` prefix for React to access it
  - Use your Vercel backend deployment URL
  - No trailing slash

**Note**: You'll need to update your frontend code to use this environment variable instead of hardcoded `localhost:5000`. See the code updates section below.

---

## Example Environment Variables Setup

### Backend Variables:
```
MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dashboard?retryWrites=true&w=majority
JWT_SECRET = your_super_secret_jwt_key_make_it_long_and_random_123456789
PORT = 5000 (optional - Vercel sets this automatically)
```

### Frontend Variables:
```
REACT_APP_API_URL = https://your-backend-app.vercel.app/api
```

---

## Important Notes

### 🔒 Security
- **Never commit** `.env` files to Git (already in `.gitignore`)
- Use **strong, random** JWT secrets
- Use **different secrets** for development and production
- Keep your MongoDB credentials secure

### 🌐 MongoDB Atlas Configuration
- Make sure your MongoDB Atlas cluster allows connections from Vercel
- In MongoDB Atlas → Network Access:
  - Add `0.0.0.0/0` to allow all IPs (for testing)
  - Or add Vercel's IP ranges for production

### 🔄 After Adding Variables
- **Redeploy** your application for changes to take effect
- Vercel will automatically use the new environment variables

---

## Verifying Environment Variables

After deployment, you can verify your environment variables are working:

1. Check Vercel deployment logs
2. Look for: `MongoDB Connected` (should appear in logs)
3. If you see connection errors, verify:
   - `MONGODB_URI` is correct
   - MongoDB Atlas IP whitelist includes Vercel
   - Credentials are correct

---

## Code Updates Needed for Frontend

You need to update your frontend code to use the environment variable instead of hardcoded localhost. Update these files:

### 1. `frontend/src/context/AuthContext.js`
Change:
```javascript
const API_URL = 'http://localhost:5000/api';
```
To:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 2. `frontend/src/pages/AdminDashboard.js`
Change:
```javascript
const API_URL = 'http://localhost:5000/api';
```
To:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 3. `frontend/src/pages/StudentDashboard.js`
Change:
```javascript
const API_URL = 'http://localhost:5000/api';
```
To:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

---

## Quick Checklist

### Backend:
- [ ] `MONGODB_URI` added with your MongoDB Atlas connection string
- [ ] `JWT_SECRET` added with a strong random string
- [ ] Variables enabled for Production, Preview, and Development
- [ ] MongoDB Atlas IP whitelist configured

### Frontend:
- [ ] `REACT_APP_API_URL` added with your backend Vercel URL
- [ ] Frontend code updated to use `process.env.REACT_APP_API_URL`
- [ ] Variables enabled for Production, Preview, and Development

### Deployment:
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Both applications redeployed after adding variables

---

## Troubleshooting

### "MongoDB connection error"
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas Network Access settings
- Check credentials in connection string

### "JWT token is not valid"
- Verify `JWT_SECRET` is set correctly
- Make sure same secret is used for signing and verifying
- Check for typos in the secret value

### "Environment variable not found"
- Verify variable name matches exactly (case-sensitive)
- Check that variables are enabled for the correct environment
- Redeploy after adding variables

---

**Your application should now be ready to deploy on Vercel!** 🚀

