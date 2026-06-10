const User = require('../models/User');
const jwt = require('jsonwebtoken');


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

class AuthController {
  
  static async register(req, res) {
    try {
      const { email, password } = req.body;

      
      if (!email || typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'email is required and must be a non-empty string'
        });
      }

      if (!password || typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'password is required and must be a non-empty string'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'password must be at least 6 characters long'
        });
      }

      
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email address already exists'
        });
      }

      
      const user = await User.create({ email, password });

      
      const token = signToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server Error during user registration'
      });
    }
  }

  
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      
      if (!email || typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'email is required and must be a non-empty string'
        });
      }

      if (!password || typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'password is required and must be a non-empty string'
        });
      }

      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      
      const token = signToken(user._id);

      return res.status(200).json({
        success: true,
        token,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server Error during login authentication'
      });
    }
  }
}

module.exports = AuthController;
