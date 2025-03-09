const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Define the GET /users endpoint
router.get('/users', controllers.getUsers);

// Define the POST /upload endpoint
router.post('/upload', controllers.uploadCSV);

module.exports = router;
