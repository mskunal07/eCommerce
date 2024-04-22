import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { confirmeOrder, createOrder, deleteOrder, updateOrder } from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(verifyJWT,createOrder)
router.route("/update/:id").post(verifyJWT,updateOrder)
router.route("/delete/:id").post(verifyJWT,deleteOrder)
router.route("/confirmOrder/:id").post(verifyJWT,confirmeOrder)

export default router