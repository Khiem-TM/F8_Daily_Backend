import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = 3000;

// Middleware để parse JSON
app.use(express.json());

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
