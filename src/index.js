import express from 'express';
import routes from './routes.js';

const app = express();

// Middleware to parse URL-encoded and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the defined routes
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
