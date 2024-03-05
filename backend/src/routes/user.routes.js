import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
// import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
// import {upload} from "../middlewares/multer.middleware.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/Register").post(
    registerUser
);

// router.route("/login").post(loginUser);

// secure routes
// router.route("/logout").post(verifyJWT, logoutUser);
// router.route("/refresh-token").post(refreshAccessToken);


export default router