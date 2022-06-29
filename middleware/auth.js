require('dotenv').config();
const jwt = require('jsonwebtoken');

const config = process.env;

const generateJWTToken = (userId, email) => {
  return jwt.sign({ userId: userId, email: email }, process.env.TOKEN_KEY, {
    expiresIn: '4h',
    issuer: 'TiffinPlanetAPI',
    audience: 'TiffinPlanetAPI',
  });
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Return Unauthorized response
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
    // Return Forbidden response
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = { generateJWTToken, authenticateToken };
