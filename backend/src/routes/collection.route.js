import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addCollection, addProductToSubCollection, addSubCollection, deleteCollection, removeProductFromSubCollection, removeSubCollectionFromCollection, updateCollectionImage, updateSubCollectionImage } from "../controllers/collection.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/addCollection").post(verifyJWT,

    upload.fields([
        {
            name:"collectionImage",
            maxCount:1
        }
    ])

,addCollection)



router.route("/addSubCollection").post(verifyJWT,

    upload.fields([
        {
            name:"subCollectionImage",
            maxCount:1
        }
    ])

,addSubCollection)


router.route("/addProductToSubCollection").post(verifyJWT,addProductToSubCollection)
router.route("/deleteCollection").post(verifyJWT,deleteCollection)
router.route("/removeProductFromSubCollection").post(verifyJWT,removeProductFromSubCollection)
router.route("/removeSubCollectionFromCollection").post(verifyJWT,removeSubCollectionFromCollection)
router.route("/updateCollectionImage").post(verifyJWT,
    
    upload.fields([
        {
            name:"collectionImage",
            maxCount:1
        }
    ])

,updateCollectionImage)

router.route("/updateSubCollectionImage").post(verifyJWT,

    upload.fields([
        {
            name:"subCollectionImage",
            maxCount:1
        }
    ])

,updateSubCollectionImage)


export default router