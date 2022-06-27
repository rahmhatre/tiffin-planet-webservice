require('dotenv').config();

const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');

// Routes
const users = require('./routes/users');
const orders = require('./routes/orders');

// DB URL
const mongoString = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoString);
const database = mongoose.connection;

// Log exception if error
database.on('error', (error) => {
  console.log(error);
});

// Console log once connection established
database.once('connected', () => {
  console.log('Database Connected');
});

// App
const app = express();
app.use(express.json());

// Enable CORS
app.use(cors());

// API base URL for all endpoints
app.use('/api', users);
app.use('/api', orders);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
