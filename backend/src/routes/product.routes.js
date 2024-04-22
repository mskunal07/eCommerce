import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addProduct, getProductById, getallproducts } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/add").post(verifyJWT,

    upload.fields([
        {
            name:"productImage",
            maxCount:1
        }
    ])

,addProduct)

router.route("/getproduct/:id").post(getProductById)
router.route("/getallproducts").post(getallproducts)

export default router