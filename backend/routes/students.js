const express = require('express');
const Student = require('../models/Student');
const { authenticate, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all students (Admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single student by ID (Admin) or own profile (Student)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If user is student, they can only view their own profile
    if (req.user.role === 'student') {
      // Check if student email matches user email
      if (student.email !== req.user.email) {
        return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
      }
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student by email (for student dashboard)
router.get('/profile/me', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'This endpoint is for students only' });
    }

    let student = await Student.findOne({ email: req.user.email });
    
    // If student profile doesn't exist, create one automatically
    if (!student) {
      student = new Student({
        name: req.user.name,
        email: req.user.email,
        course: 'MERN Bootcamp', // Default course
        enrollmentDate: new Date()
      });
      await student.save();
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create student (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, email, course, enrollmentDate } = req.body;

    if (!name || !email || !course) {
      return res.status(400).json({ message: 'Please provide name, email, and course' });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists with this email' });
    }

    const student = new Student({
      name,
      email,
      course,
      enrollmentDate: enrollmentDate || new Date()
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student (Admin can update any, Student can only update own)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If user is student, they can only update their own profile
    if (req.user.role === 'student') {
      if (student.email !== req.user.email) {
        return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
      }
      // Students can only update name, email, and course
      const { name, email, course } = req.body;
      if (name) student.name = name;
      if (email) student.email = email;
      if (course) student.course = course;
    } else {
      // Admin can update all fields
      const { name, email, course, enrollmentDate } = req.body;
      if (name) student.name = name;
      if (email) student.email = email;
      if (course) student.course = course;
      if (enrollmentDate) student.enrollmentDate = enrollmentDate;
    }

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete student (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

