const mongoose = require('mongoose');
const validator = require('validator'); // For email validation

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Last name is required'] },
  username: { type: String, required: [true, 'Username is required'], unique: true },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    validate: [validator.isEmail, 'Please enter a valid email']  // Email format validation
  },
  password: { type: String, required: [true, 'Password is required'] },
  role: { type: String, enum: ['user', 'admin', 'superAdmin'], default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
