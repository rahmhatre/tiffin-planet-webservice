require('dotenv').config();
const express = require('express');
const register = express.Router();
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { UserStatus, AuthMode, UserType } = require('./../common/Enums');
const { generateJWTToken } = require('./../middleware/auth');

register.post('/register', async (req, res) => {
  // Null check for name, email and password
  if (!req?.body?.email || !req?.body?.name || !req?.body?.password) {
    return res.status(401).json({ status: 401, message: 'Please check the registration credentials supplied.' });
  }

  // Find if we have user with same email already saved
  const userExists = await UserModel.findOne({ email: req?.body?.email });
  if (userExists) {
    return res.status(409).json({ status: 400, message: 'User already exists.' });
  }

  // Construct object in mongoose for saving
  const data = new UserModel({
    name: req?.body?.name,
    email: req?.body?.email,
    authMode: AuthMode.CLASSIC,
    password: req?.body?.password,
    userType: req?.body?.userType,
    isShopVerified: false,
    status: UserStatus.ACTIVE,
  });

  try {
    const dataToSave = await data.save();
    // Create NEW jwt token and save in db
    const newlyCreatedObj = await generateJWTTokenAndSaveUpdateDB(dataToSave?._id, dataToSave?.email);
    res.status(201).json({ status: 201, message: 'User created successfully.' });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Login by username and password
register.post('/login', async (req, res) => {
  try {
    // Null check for email and password
    if (!req?.body?.email || !req?.body?.password) {
      return res.status(401).json({ status: 401, message: 'Please check the login credentials supplied.' });
    }
    // Find if we have user with same email already saved
    const userExists = await UserModel.findOne({ email: req?.body?.email });
    if (!userExists) {
      return res.status(401).json({ status: 401, message: 'User does not exists. Please sign up to register.' });
    }
    await userExists.comparePassword(req?.body?.password, async (matchError, isMatch) => {
      if (matchError) {
        return res.status(401).json({ status: 401 });
      } else if (!isMatch) {
        return res.status(401).json({ status: 401 });
      } else {
        // Create NEW jwt token and save in db
        const newlyCreatedObj = await generateJWTTokenAndSaveUpdateDB(userExists?._id, userExists?.email);
        return res.status(200).json({ status: 200 });
      }
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Login by email and username which is authenticated with Google
register.post('/googlelogin', async (req, res) => {
  try {
    // Null check for email and name
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
        // Create NEW jwt token and save in db
        const newlyCreatedObj = await generateJWTTokenAndSaveUpdateDB(userExists?._id, userExists?.email);
        return res.status(200).json({ status: 200, message: 'User created and logged in successfully.' });
      } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
      }
    }

    // Create NEW jwt token and save in db
    const newlyCreatedObj = await generateJWTTokenAndSaveUpdateDB(userExists?._id, userExists?.email);
    return res.status(200).json({ status: 200, message: 'User logged in successfully.' });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

const generateJWTTokenAndSaveUpdateDB = async (userId, email) => {
  // Create NEW jwt token and save in db
  const token = generateJWTToken(userId, email);
  // Save the token back to the newly created user
  return await UserModel.findOneAndUpdate({ _id: userId }, { accessToken: token }, { new: true });
};

module.exports = register;
