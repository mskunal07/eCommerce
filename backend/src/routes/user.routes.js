import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, registerUser, updateAccountDetails,addProductToWishlist, addProductToCart, removeProductFromWishList, removeProductFromCart } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addProduct } from "../controllers/product.controller.js";
// import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
// import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/Register").post(
    registerUser
);

router.route("/login").post(loginUser);



// secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/updateAccountDetails").post(verifyJWT,updateAccountDetails);
router.route("/updateAccountPassword").post(verifyJWT,changeCurrentPassword);
router.route("/addProductToWishlist").post(verifyJWT,addProductToWishlist);
router.route("/removeProductFromWishList").post(verifyJWT,removeProductFromWishList);
router.route("/addProductToCart").post(verifyJWT,addProductToCart);
router.route("/removeProductFromCart").post(verifyJWT,removeProductFromCart);

// router.route("/refresh-token").post(refreshAccessToken);


export default router