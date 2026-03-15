const express = require("express");
const path = require("path");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Đọc dữ liệu data từ form HTML

// session configuration
app.use(
  session({
    secret: "khiemdeptraikhoaito",
    resave: false,
    saveUninitialized: false,
  })
);

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);

app.use("/", authRouter);

// Error handling 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
