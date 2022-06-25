const express = require("express");
const orders = express.Router();
const baseURL = "/orders";

//Post Method
orders.post(baseURL, (req, res) => {
  res.send("Post API");
});

//Get all Method
orders.get(baseURL, (req, res) => {
  res.send("Get All API");
});

//Get by ID Method
orders.get(`${baseURL}/:id`, (req, res) => {
  res.send("Get by ID API");
});

//Update by ID Method
orders.patch(`${baseURL}/:id`, (req, res) => {
  res.send("Update by ID API");
});

//Delete by ID Method
orders.delete(`${baseURL}/:id`, (req, res) => {
  res.send("Delete by ID API");
});

module.exports = orders;
