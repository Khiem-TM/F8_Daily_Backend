import express from "express";
import * as ProductController from "./controller/product.controller.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

app.get("/products", ProductController.getProducts);
app.get("/products/:id", ProductController.getProduct);
app.post("/products", ProductController.createProduct);
app.put("/products/:id", ProductController.updateProduct);
app.delete("/products/:id", ProductController.deleteProduct);

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
