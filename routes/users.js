const express = require('express');
const users = express.Router();
const UserModel = require('../models/userModel');
const baseURL = '/users';
const { UserStatus, AuthMode, UserType } = require('./../common/Enums');

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
users.post(`${baseURL}/login`, async (req, res) => {
  try {
    console.log('🚀 ~ file: users.js ~ line 48 ~ users.get ~ req?.body', req?.body);
    if (!req?.body?.email || !req?.body?.password) {
      return res.status(401).json({ status: 401, message: 'Please check the login credentials supplied.' });
    }
    // Find if we have user with same email already saved
    const userExists = await UserModel.findOne({ email: req?.body?.email });
    if (!userExists) {
      return res.status(401).json({ status: 401, message: 'User does not exists. Please sign up to register.' });
    }

    userExists.comparePassword(req?.body?.password, (matchError, isMatch) => {
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

// Login by email and username which is authenticated with Google
users.post(`${baseURL}/googlelogin`, async (req, res) => {
  try {
    if (!req?.body?.email || !req?.body?.name) {
      return res.status(401).json({ status: 401, message: 'Please check the login credentials supplied.' });
    }

    // Find if we have user with same email already saved
    const userExists = await UserModel.findOne({ email: req?.body?.email });

    // If user does not exist then create a new user with email and user name and let him login
    if (!userExists) {
      // POST user
      const data = new UserModel({
        name: req?.body?.name,
        email: req?.body?.email,
        authMode: AuthMode.GOOGLE,
        userType: UserType.USER,
        isShopVerified: false,
        status: UserStatus.ACTIVE,
      });
      try {
        const dataToSave = await data.save();
        return res.status(200).json({ status: 200, message: 'User created and logged in successfully.' });
      } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
      }
    }
    return res.status(200).json({ status: 200, message: 'User logged in successfully.' });
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
