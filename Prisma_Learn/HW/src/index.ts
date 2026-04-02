import express from "express";
import router from "./routes/index.route";

const app = express();
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
