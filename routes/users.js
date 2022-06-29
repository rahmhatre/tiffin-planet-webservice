const express = require('express');
const users = express.Router();
const UserModel = require('../models/userModel');
const auth = require('./../middleware/auth');
const baseURL = '/users';
const { UserStatus, AuthMode, UserType } = require('./../common/Enums');

//Get all Method
users.get(baseURL, async (req, res) => {
  try {
    console.log('🚀 ~ file: users.js ~ line 48 ~ users.get ~ req?.query', req?.query);
    const data = await UserModel.find(req?.query);
    return res.json(data);
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

//Get by ID Method
users.get(`${baseURL}/:id`, async (req, res) => {
  try {
    const data = await UserModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ status: 404, message: 'No result found.' });
    }
    return res.json(data);
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

//Update by ID Method
users.patch(`${baseURL}/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await UserModel.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

//Delete by ID Method
users.delete(`${baseURL}/:id`, (req, res) => {
  res.status(501).send('Delete by ID API');
});

module.exports = users;
