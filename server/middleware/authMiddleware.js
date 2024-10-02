import jwt from 'jsonwebtoken';
import User from '../user/userModel.js';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) throw Error('User does not exist');
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error_message: error.message });
    }
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.log('Not authorized as admin');
    return res.status(401).json({ error_message: 'Not authorized as admin' });
  }
};

export { protect, admin };
