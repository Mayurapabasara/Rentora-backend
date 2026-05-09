import express from 'express';
import {createOrder, getOrder, updateOrderStatus} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder)
orderRouter.get("/", getOrder)
orderRouter.put("/status/:orderID", updateOrderStatus)

export default orderRouter;