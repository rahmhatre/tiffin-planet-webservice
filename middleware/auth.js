require('dotenv').config();
const jwt = require('jsonwebtoken');

const config = process.env;

const generateJWTToken = (userId, email) => {
  return jwt.sign({ user_id: userId, email: email }, process.env.TOKEN_KEY, {
    expiresIn: '4h',
    issuer: 'TiffinPlanetAPI',
    audience: 'TiffinPlanetAPI',
  });
};

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

module.exports = { generateJWTToken, verifyToken };
