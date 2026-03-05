const userService = require("../services/userService");

exports.getUsers = (req, res, next) => {
  try {
    const q = req.query.q;
    const users = userService.getUsers(q);
    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = userService.getUserById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.createUser = (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }
    const newUser = userService.createUser(name, email);
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

exports.updatedUser = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }
    const updatedUser = userService.updateUser(id, name, email);
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deletedUser = userService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
