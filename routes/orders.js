const express = require('express');
const moment = require('moment');
const orders = express.Router();
const OrderModel = require('../models/orderModel');
const UserModel = require('../models/userModel');
const baseURL = '/orders';

//Post Method
orders.post(baseURL, async (req, res) => {
  // Null check for userid
  if (!req?.body?.userId) {
    return res.status(401).json({ status: 401, message: 'Please check the registration credentials supplied.' });
  }

  // Check if user exists
  const userExists = await UserModel.findById(req?.body?.userId);
  if (!userExists) {
    return res.status(404).json({ status: 400, message: 'User does not exists.' });
  }

  // Convert order shipment date to Date Format
  const dateObj = moment(req?.body?.orderShipmentDate).startOf('day');
  // Check if you have an order for the same day which you are trying to create
  const orderExists = await OrderModel.findOne({
    orderShipmentDate: {
      $gte: dateObj.toDate(),
      $lte: moment(dateObj).endOf('day').toDate(),
    },
  });
  if (orderExists) {
    return res.status(400).json({ status: 400, message: 'Order already exists on the same day, please update the order instead.' });
  }

  // Construct object in mongoose for saving
  const data = new OrderModel({
    userId: req?.body?.userId,
    orderShipmentDate: req?.body?.orderShipmentDate,
    status: req?.body?.status,
  });

  try {
    const dataToSave = await data.save();
    res.status(201).json({ status: 201, message: 'Order saved successfully.' });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

//Get all Method
orders.get(baseURL, async (req, res) => {
  try {
    const data = await OrderModel.find(req?.query);
    return res.json(data);
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

//Get by ID Method
orders.get(`${baseURL}/:id`, async (req, res) => {
  try {
    const data = await OrderModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ status: 404, message: 'No result found.' });
    }
    return res.json(data);
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

//Update by ID Method
orders.patch(`${baseURL}/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await OrderModel.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

//Delete by ID Method
orders.delete(`${baseURL}/:id`, (req, res) => {
  res.status(501).send('Delete by ID API');
});

module.exports = orders;
