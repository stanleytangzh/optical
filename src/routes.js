import express from 'express';
import * as controllers from './controllers.js';
const router = express.Router();


// Define the GET /users endpoint
router.get('/users', controllers.getUsers);

// Define the POST /upload endpoint
router.post('/upload', controllers.uploadCSV);

export default router;
