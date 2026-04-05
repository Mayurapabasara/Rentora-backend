import express from "express";
import { createUser, getUsers, loginUser, isAdmin } from "../controllers/userController.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", isAdmin, createProduct);

productRouter.delete("/:productId", isAdmin, deleteProduct);
productRouter.put("/:productId", isAdmin, updateProduct);
productRouter.get("/:productId", getProductById);

export default productRouter;



