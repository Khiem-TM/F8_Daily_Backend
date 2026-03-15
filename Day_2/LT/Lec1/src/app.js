const express = require("express");
const indexRouter = require("./routes/user.routes.js");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use("/api", indexRouter);

// Error handling 404
app.use((req, res, next) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
