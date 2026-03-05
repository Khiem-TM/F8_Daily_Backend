const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "users.json");

// Return all users with object format {id, name, email}
function readUsers() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// The input is an object with new updated user information
function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

// GET /users --> This function just care about read data users (q) so that we can see where res and req in input of this function.
exports.getUsers = (q) => {
  let users = readUsers();
  if (q) {
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase())
    );
  }
  return users;
};

// GET /users/:id
exports.getUserById = (id) => {
  const users = readUsers();
  return users.find((u) => u.id === id);
};

// POST /users
exports.createUser = (name, email) => {
  const users = readUsers();
  const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = { id, name, email };
  users.push(newUser);
  writeUsers(users);
  return newUser;
};

// PUT /users/:id
exports.updateUser = (id, name, email) => {
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.id === id);
  // Th không tồn tại user
  if (userIndex === -1) {
    return null;
  }
  users[userIndex] = { id, name, email };
  writeUsers(users);
  return users[userIndex];
};

// DELETE /users/:id
exports.deleteUser = (id) => {
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.id === id);
  // Th không tồn tại user
  if (userIndex === -1) {
    return false;
  }
  // Xoá user tại vị trí userIndex
  users.splice(userIndex, 1);
  writeUsers(users);
  return true;
};
