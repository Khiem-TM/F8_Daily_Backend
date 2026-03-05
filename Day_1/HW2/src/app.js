const express = require("express");
const userRoutes = require("./routes/userRoute");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/", userRoutes);

// Middleware xử lý lỗi
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
