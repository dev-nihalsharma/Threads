import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return req.status(401).json({ message: 'Un-Authorized' });
    }
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded_token.userId).select('-password');

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log('Error at Protected Route: ', error.message);
  }
};

export default protectedRoute;
