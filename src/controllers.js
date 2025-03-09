import * as db from './db.js';
import * as csvProcessor from './csvProcessor.js';

export const getUsers = (req, res) => {
  // Parse query parameters with defaults
  let { min = 0.0, max = 4000.0, offset = 0, limit, sort } = req.query;
  min = parseFloat(min);
  max = parseFloat(max);
  offset = parseInt(offset);

  // Get all users from the in-memory database
  let users = db.getUsers();

  // Filter users by salary range
  users = users.filter(user => user.salary >= min && user.salary <= max);

  // Sorting logic (case-insensitive)
  if (sort) {
    sort = sort.toLowerCase();
    if (sort === 'name') {
      users.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'salary') {
      users.sort((a, b) => a.salary - b.salary);
    } else {
      return res.status(400).json({ error: 'Invalid sort parameter' });
    }
  }

  // Apply offset and limit
  if (offset) {
    users = users.slice(offset);
  }
  if (limit) {
    limit = parseInt(limit);
    users = users.slice(0, limit);
  }

  res.status(200).json({ results: users });
};

export const uploadCSV = (req, res) => {
  // Retrieve CSV content from form field "file"
  const csvData = req.body.file;
  if (!csvData) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    // Process CSV data using the helper function
    const processedUsers = csvProcessor.processCSV(csvData);
    // Update the database with each valid user entry
    processedUsers.forEach(user => {
      db.upsertUser(user);
    });
    res.status(200).json({ success: 1 });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
