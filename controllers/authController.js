const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { firstName, lastName, username, email, password, role } = req.body;
  
    // Valid roles are 'user', 'admin', and 'superAdmin'
    const validRoles = ['user', 'admin', 'superAdmin'];
    const userRole = validRoles.includes(role) ? role : 'user';
  
    try {
      // Check if the email or username is already registered
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ error: 'Email or username is already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user instance
      const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role: userRole
      });
  
      // Save the user to the database
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
  
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation errors from Mongoose
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ error: messages.join(', ') });
      }
      if (error.code === 11000) {
        // Handle duplicate key error for unique fields (email, username)
        const duplicateField = Object.keys(error.keyPattern)[0];
        return res.status(400).json({ error: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} is already taken` });
      }
  
      res.status(500).json({ error: 'Server error' });
    }
  };

  exports.login = async (req, res) => {
    const { email, password } = req.body; // Using email instead of username
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      // Generate a JWT token with user ID and role (with a hardcoded secret key)
      const token = jwt.sign({ id: user._id, role: user.role }, 'yourSecretKeyHere', { expiresIn: '1d' });
      
      res.json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };