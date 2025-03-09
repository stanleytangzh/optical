// In-memory user storage
const users = [];

// Seed initial data if empty
if (users.length === 0) {
  users.push({ name: 'Alex', salary: 3000.0 });
  users.push({ name: 'Bryan', salary: 3500.0 });
}

exports.getUsers = () => users;

exports.upsertUser = (user) => {
  const index = users.findIndex(u => u.name === user.name);
  if (index !== -1) {
    // Update existing user
    users[index] = user;
  } else {
    // Insert new user
    users.push(user);
  }
};
