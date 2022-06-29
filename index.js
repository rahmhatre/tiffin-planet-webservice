require('dotenv').config();

const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');

const { authenticateToken } = require('./middleware/auth');

// Routes
const register = require('./routes/register');
const users = require('./routes/users');
const orders = require('./routes/orders');

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

// TODO: Old MongoDB connection code
// const database = mongoose.connection;
// // Log exception if error
// database.on('error', (error) => {
//   console.log(error);
// });
// // Console log once connection established
// database.once('connected', () => {
//   console.log('Database Connected');
// });

// App
const app = express();
app.use(express.json());

// Enable CORS
app.use(cors());

// API base URL for all endpoints
app.use('/api', register);
app.use('/api', authenticateToken, users);
app.use('/api', authenticateToken, orders);

app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
