import jwt from 'jsonwebtoken';

export const createToken = (user) => {
  return jwt.sign(
    { 
      sub: user._id.toString(),
      email: user.email 
    },
    process.env.ACCESS_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_SECRET);
};