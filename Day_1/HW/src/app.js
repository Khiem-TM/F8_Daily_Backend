const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
// yc1
app.get("/users", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "users.json");
    // Đọc dữ liệu từ file users.json
    const data = fs.readFileSync(filePath, "utf-8");
    let users = JSON.parse(data);

    // Lọc user dựa trên query GET /users?q=abc
    const qr = req.query.q;
    if (qr) {
      const keyword = qr.toLowerCase();
      users = users.filter((user) => {
        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        return name.includes(keyword) || email.includes(keyword);
      });
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      error: "Lỗi đọc data users",
    });
  }
});

// yc2
app.get("/users/:id", (req, res) => {
  try {
    const userId = Number(req.params.id);
    const filePath = path.join(__dirname, "data", "users.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const users = JSON.parse(data);
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      error: "Lỗi đọc data users",
    });
  }
});

// yc3
app.post("/users", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "users.json");
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        error: "Thiếu name hoặc email",
      });
    }
    const data = fs.readFileSync(filePath, "utf-8");
    const lastUser = JSON.parse(data).slice(-1)[0];
    const id = lastUser.id + 1;
    const newUser = { id, name, email };
    const updateUsers = [...JSON.parse(data), newUser];
    fs.writeFileSync(filePath, JSON.stringify(updateUsers, null, 2));
    return res.status(201).json({
      message: "Create user successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Lỗi ghi data users",
    });
  }
});

// yc4
app.put("/users/:id", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "users.json");
    const userId = Number(req.params.id);
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        error: "Thiếu name hoặc email",
      });
    }
    const data = fs.readFileSync(filePath, "utf-8");
    const users = JSON.parse(data);
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    users[userIndex] = { id: userId, name, email };
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    return res.status(200).json({
      message: "Update user successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Lỗi ghi data users",
    });
  }
});

// yc5
app.delete("/users/:id", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "users.json");
    const userId = req.params.id;
    const data = fs.readFileSync(filePath, "utf-8");
    const users = JSON.parse(data);
    const userIndex = users.findIndex((u) => u.id === Number(userId));
    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    users.splice(userIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    return res.status(200).json({
      message: "Delete user successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Lỗi ghi data users",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
