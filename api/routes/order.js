import express from "express"
import { createOrder, getOrder, getOrders, updateOrder } from "../controllers/order.js"
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();
//CREATE
router.post("/:id", createOrder);
router.get("/", verifyAdmin, getOrders);
router.get("/:id", verifyAdmin, getOrder);
router.put("/:id", verifyAdmin, updateOrder);

export default router