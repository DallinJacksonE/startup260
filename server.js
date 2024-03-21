const express = require('express');
const fs = require('fs');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');

app.use(express.json());



// Endpoints
app.get("/store/:storeName", (req, res) => {
  res.send({ name: req.params.storeName });
});

app.put("/store/:storeName", (req, res) => {
  req.body.updated = true;
  res.send(req.body);
});

module.exports = app;