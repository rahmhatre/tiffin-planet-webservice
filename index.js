require('dotenv').config();

const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');

const { authenticateToken } = require('./middleware/auth');

// Routes
const register = require('./routes/register');
const users = require('./routes/users');
const orders = require('./routes/orders');
const notifications = require('./routes/notifications');

// ENV Variables
const { DATABASE_URL, PORT } = process.env;
const port = PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((error) => {
    console.log('database connection failed. exiting now...');
    console.error(error);
    process.exit(1);
  });

// App
const app = express();
app.use(express.json());

// Enable CORS
app.use(cors());

// API base URL for all endpoints
app.use('/api', register);
app.use('/api', authenticateToken, users);
app.use('/api', authenticateToken, orders);
app.use('/api', authenticateToken, notifications);

app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
