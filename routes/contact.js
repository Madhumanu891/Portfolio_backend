const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// POST send message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    // Send email notification (optional - configure nodemailer)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `Portfolio Contact: ${subject}`,
          html: `<h3>New message from ${name} (${email})</h3><p>${message}</p>`
        });
      } catch (emailErr) {
        console.log('Email send failed (non-critical):', emailErr.message);
      }
    }

    res.status(201).json({ message: 'Message sent successfully! I will get back to you soon.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all messages (admin)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH mark as read (admin)
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
