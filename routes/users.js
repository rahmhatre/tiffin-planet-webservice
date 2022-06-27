const express = require('express');
const users = express.Router();
const UserModel = require('../models/userModel');
const baseURL = '/users';
const { UserStatus } = require('./../common/Enums');

//Post Method
users.post(baseURL, async (req, res) => {
  // Find if we have user with same email already saved
  const userExists = await UserModel.findOne({ email: req?.body?.email });
  if (userExists) {
    return res.status(400).json({ status: 400, message: 'User already exists.' });
  }

  // Construct object in mongoose for saving
  const data = new UserModel({
    name: req?.body?.name,
    email: req?.body?.email,
    authMode: req?.body?.authMode,
    password: req?.body?.password,
    userType: req?.body?.userType,
    isShopVerified: false,
    status: UserStatus.ACTIVE,
  });

  try {
    const dataToSave = await data.save();
    // res.status(200).json(dataToSave);
    res.status(200).json({ status: 200, message: 'User created successfully.' });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

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

// Login by username and password
users.get(`${baseURL}/login`, async (req, res) => {
  try {
    console.log('🚀 ~ file: users.js ~ line 48 ~ users.get ~ req?.query', req?.query);
    if (!req?.query?.email || !req?.query?.password) {
      return res.status(401).json({ status: 401, message: 'Please check the login credentials supplied.' });
    }
    // Find if we have user with same email already saved
    const userExists = await UserModel.findOne({ email: req?.query?.email });
    if (!userExists) {
      return res.status(400).json({ status: 400, message: 'User does not exists.' });
    }

    userExists.comparePassword(req?.query?.password, (matchError, isMatch) => {
      if (matchError) {
        return res.status(401).json({ status: 401 });
      } else if (!isMatch) {
        return res.status(401).json({ status: 401 });
      } else {
        return res.status(200).json({ status: 200 });
      }
    });
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
    const result = await Model.findByIdAndUpdate(id, updatedData, options);
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
