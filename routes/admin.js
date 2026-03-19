const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');

// Simple admin login (no User model needed for single admin)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, message: 'Login successful' });
});

// Verify token
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Seed initial data
router.post('/seed', auth, async (req, res) => {
  try {
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});

    await Experience.insertMany([
      {
        role: 'Associate Software Intern',
        company: 'Vpush Technologies',
        duration: 'Sep 2025 – Present',
        location: 'Hyderabad, India',
        current: true,
        order: 1,
        description: [
          'Converted Figma designs into pixel-perfect, fully responsive UI using React.js and Tailwind CSS',
          'Built interactive dashboard interfaces with charts, tables, filters, and reusable components',
          'Implemented Redux Toolkit for state management, improving data flow and reducing re-renders',
          'Integrated RESTful APIs with proper error handling and optimized rendering',
          'Ensured performance optimization and UI consistency across the application'
        ]
      }
    ]);

    await Project.insertMany([
      {
        title: 'E-commerce Web Application',
        description: 'Full-stack e-commerce platform with authentication, product management, and PayPal payments.',
        longDescription: 'Developed a complete e-commerce website using the MERN stack with user auth, product management, secure PayPal payments, JWT authentication, role-based access control, and RESTful APIs.',
        tags: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'Context API', 'PayPal'],
        featured: true, order: 1, date: 'Jun 2025'
      },
      {
        title: 'Blogger Web Application',
        description: 'Next.js blogging platform with SSR, user authentication, and full CRUD for posts.',
        longDescription: 'Built using Next.js for server-side rendering and routing. Implemented user authentication, CRUD blog posts, MongoDB storage, and Tailwind CSS for responsive styling.',
        tags: ['Next.js', 'MongoDB', 'React.js', 'JavaScript', 'Tailwind CSS', 'SSR'],
        featured: true, order: 2, date: 'Jun 2025'
      },
      {
        title: 'Result Portal',
        description: 'Full-stack result management portal with admin controls and secure authentication.',
        longDescription: 'A responsive portal for user registration, login, result entry, and admin-based result management using Context API and token-based verification.',
        tags: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Context API', 'React Router'],
        featured: true, order: 3, date: 'May 2025'
      },
      {
        title: 'MERN Stack Todo App',
        description: 'Full-stack task manager with real-time updates and active/completed task views.',
        longDescription: 'Developed with task creation, editing, deletion, completion tracking. Separate views for active and completed tasks. Real-time updates using RESTful APIs.',
        tags: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Axios', 'Mongoose'],
        featured: false, order: 4, date: 'Apr 2025'
      },
      {
        title: 'Social Media Spam Detector',
        description: 'ML-based spam detection system using Net Spam framework with NLP classification.',
        longDescription: 'Built with Python using the Net Spam framework and probabilistic models. Evaluated using precision, recall, and F1-score metrics.',
        tags: ['Python', 'Machine Learning', 'NLP', 'Net Spam', 'scikit-learn'],
        featured: false, order: 5, date: 'Jan 2023'
      }
    ]);

    await Skill.insertMany([
      { name: 'React.js', category: 'Frontend', level: 90, order: 1 },
      { name: 'Next.js', category: 'Frontend', level: 80, order: 2 },
      { name: 'Redux Toolkit', category: 'Frontend', level: 82, order: 3 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 88, order: 4 },
      { name: 'HTML5 / CSS3', category: 'Frontend', level: 92, order: 5 },
      { name: 'Node.js', category: 'Backend', level: 80, order: 1 },
      { name: 'Express.js', category: 'Backend', level: 78, order: 2 },
      { name: 'REST APIs', category: 'Backend', level: 85, order: 3 },
      { name: 'JWT Auth', category: 'Backend', level: 80, order: 4 },
      { name: 'MongoDB', category: 'Database', level: 82, order: 1 },
      { name: 'MySQL', category: 'Database', level: 72, order: 2 },
      { name: 'JavaScript', category: 'Languages', level: 88, order: 1 },
      { name: 'Python', category: 'Languages', level: 75, order: 2 },
      { name: 'Git & GitHub', category: 'Tools', level: 85, order: 1 },
      { name: 'Figma to UI', category: 'Tools', level: 88, order: 2 },
      { name: 'Axios', category: 'Tools', level: 82, order: 3 }
    ]);

    res.json({ message: '✅ Database seeded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
