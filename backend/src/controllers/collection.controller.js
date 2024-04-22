import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import jwt from "jsonwebtoken";
import { loginUser } from "./user.controller.js";
import { Collection } from "../models/collection.model.js";
import { subCollection } from "../models/subCollection.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const addCollection = asyncHandler( async(req,res) => {

    const user = req.user;

    if(!user.verifyAdmin()) throw new ApiError(401,"You are not Authorized !! ");

    try{

        const {collectionName} = req.body;
        console.log(req.body);

        if(
            [collectionName].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400,"All fields are compulsory ! ");
        }

        const collectionImgLocalPath = req.files?.collectionImage[0]?.path;

        if(!collectionImgLocalPath)  throw new ApiError(400,"Collection Img is required ! ");
          
        const collectionImage = await uploadOnCloudinary(collectionImgLocalPath);
          
        if(!collectionImage) throw new ApiError(400,"Error in uploading Collection img on Cloudinary ! ");
    

        const collection = await Collection.create({
            name:collectionName,
            collectionImage:collectionImage?.url,
            subcollection:[]
        });

        const createdCollection = await Collection.findById(collection._id);

       
        if(!createdCollection) throw new ApiError(500,"Something went wrong while creating the collection ! ");

    
        return res.status(201).json(
            new ApiResponse(200,createdCollection,"collection created !! ")
        )
    

    } catch (error) {
        throw new ApiError(500,error?.message || "Problem in creating Collection ! ");
    }
});


const addSubCollection = asyncHandler( async(req,res) => {

    const user = req.user;

    if(!user.verifyAdmin()) throw new ApiError(401,"You are not Authorized !! ");

    try{

        const {subCollectionName,collectionid} = req.body;
        console.log(req.body);


        if(
            [subCollectionName,collectionid].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400,"All fields are compulsory ! ");
        }

        const parentCollection = await Collection.findById(collectionid);

        const existedSubCollectionIndex = parentCollection.subcollection.findIndex(item => item.toString() === subCollectionName.toString());

        if(existedSubCollectionIndex !== -1) {
            throw new ApiError(400, "This Sub Collection already exists in the Collection");
        }

        const subcollectionImgLocalPath = req.files?.subCollectionImage[0]?.path;

        if(!subcollectionImgLocalPath)  throw new ApiError(400,"subCollectionImage is required ! ");
          
        const subCollectionImage = await uploadOnCloudinary(subcollectionImgLocalPath);
          
        if(!subCollectionImage) throw new ApiError(400,"Error in uploading subCollectionImage on Cloudinary ! ");
    


        const newsubcollection = await subCollection.create({
            name:subCollectionName,
            subCollectionImage:subCollectionImage?.url,
            products:[]
        });

        const createdsubCollection = await subCollection.findById(newsubcollection._id);

       
        if(!createdsubCollection) throw new ApiError(500,"Something went wrong while creating the sub collection ! ");

        parentCollection.subcollection.push(createdsubCollection._id);
        await parentCollection.save();

        return res.status(200)
        .json(
            new ApiResponse(200,createdsubCollection," sub-collection added Successfully to the cart !! ")
        );
    

    } catch (error) {
        throw new ApiError(500,error?.message || "Problem in creating sub Collection ! ");
    }
});


const addProductToSubCollection = asyncHandler( async(req,res) => {

    const user = req.user;

    if(!user.verifyAdmin()) throw new ApiError(401,"You are not Authorized !! ");

    try{

        const {subcollectionId,productId} = req.body;
        console.log(req.body);

        if(
            [subcollectionId].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400,"Sub collection ID required to add Products ! ");
        }

        const toAddSubCollection = await subCollection.findById(subcollectionId);

        if(!toAddSubCollection) throw new ApiError(500,"Sub Collection do NOT exist ! ");

        const existedProduct = toAddSubCollection.products.findIndex(item => item.toString() === productId.toString());

        if(existedProduct !== -1) {
            throw new ApiError(400, `Product with Id ${productId}  already exists in the sub Collection`);
        }

        toAddSubCollection.products.push(productId);
        await toAddSubCollection.save();
       
        return res.status(200)
        .json(
            new ApiResponse(200,toAddSubCollection,"Products added to sub-collection !! ")
        );
    

    } catch (error) {
        throw new ApiError(500,error?.message || "Problem in adding Products to sub Collection ! ");
    }
});


const deleteCollection = asyncHandler( async(req,res) => {

    const user = req.user;

    if(!user.verifyAdmin()) throw new ApiError(401,"You are not Authorized !! ");

    try{

        const {collectionId} = req.body;
        console.log(req.body);

        if(
            [collectionId].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400,"All fields are compulsory ! ");
        }

        const deletedCollection = await Collection.findByIdAndDelete(collectionId);

        if(!deletedCollection) throw new ApiError(400,"Problem in deleting Collection either NOT exist of database error")

        return res.status(201).json(
            new ApiResponse(200,deletedCollection,"collection Deleted !! ")
        )
    
    } catch (error) {
        throw new ApiError(500,error?.message || "Problem in creating Collection ! ");
    }
});


const deleteSubCollection = asyncHandler( async(req,res) => {

    const user = req.user;

    if(!user.verifyAdmin()) throw new ApiError(401,"You are not Authorized !! ");

    try{

        const {subcollectionId} = req.body;
        console.log(req.body);

        if(
            [subcollectionId].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400,"All fields are compulsory ! ");
        }

        const deletedsubCollection = await Collection.findByIdAndDelete(subcollectionId);

        if(!deletedsubCollection) throw new ApiError(400,"Problem in deleting sub Collection either NOT exist of database error")

        return res.status(201).json(
            new ApiResponse(200,deletedsubCollection,"sub collection Deleted !! ")
        )
    
    } catch (error) {
        throw new ApiError(500,error?.message || "Problem in creating Collection ! ");
    }
});

const removeProductFromSubCollection = asyncHandler( async(req,res) => {

    const user = req.user;

    if(!user.verifyAdmin()) throw new ApiError(401,"You are not Authorized !! ");

    try{

        const {productID,subCollectionID} = req.body;
        console.log(req.body);

        if(
            [productID,subCollectionID].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400,"All fields are compulsory ! ");
        }

        const ManipulatingSubCollection = await subCollection.findById(subCollectionID);

        if(!ManipulatingSubCollection) throw new ApiError(400,"Sub Collection NOT FOUND ! ");

        const productIdIndex = ManipulatingSubCollection.products.findIndex(item => item._id.toString() === productID.toString());

        if(productIdIndex === -1) {
            throw new ApiError(400, "Product Do NOT exist in Sub Collection");
        }

        ManipulatingSubCollection.products.splice(productIdIndex,1);
        await ManipulatingSubCollection.save();
    
        return res.status(201).json(
            new ApiResponse(200,ManipulatingSubCollection,"Product Removed From Sub Collection !! ")
        )
    
    } catch (error) {
        throw new ApiError(500,error?.message || "Problem in removing Product from sub collection ! ");
    }
});

const removeSubCollectionFromCollection = asyncHandler( async(req,res) => {

    const user = req.user;

    if(!user.verifyAdmin()) throw new ApiError(401,"You are not Authorized !! ");

    try{

        const {CollectionID,subCollectionID} = req.body;
        console.log(req.body);

        if(
            [CollectionID,subCollectionID].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400,"All fields are compulsory ! ");
        }

        const ManipulatingCollection = await Collection.findById(CollectionID);

        if(!ManipulatingCollection) throw new ApiError(400,"Sub Collection NOT FOUND ! ");

        const subCollectionIdIndex = ManipulatingCollection.subcollection.findIndex(item => item._id.toString() === subCollectionID.toString());

        if(subCollectionIdIndex === -1) {
            throw new ApiError(400, "Sub Collection Do NOT exist in Collection");
        }

        ManipulatingCollection.subcollection.splice(subCollectionIdIndex,1);
        await ManipulatingCollection.save();
    
        return res.status(201).json(
            new ApiResponse(200,ManipulatingCollection,"Sub Collection Removed From Collection !! ")
        )
    
    } catch (error) {
        throw new ApiError(500,error?.message || "Problem in removing Sub Collection from collection ! ");
    }
});


const updateCollectionImage = asyncHandler(async(req,res) => {

    const {collectionID} = req.body;

    const collectionImgLocalPath = req.files?.collectionImage[0]?.path;

    if(!collectionImgLocalPath)  throw new ApiError(400,"Collection Img is required ! ");
          
    const collectionImage = await uploadOnCloudinary(collectionImgLocalPath);
          
    if(!collectionImage) throw new ApiError(400,"Error in uploading Collection img on Cloudinary ! ");
    
    const collection = await User.findByIdAndUpdate(
        collectionID,
        {
            $set:{  

                collectionImage:collectionImage.url
            }
        },
        {
            new:true
        }
    );

    return res.status(200)
    .json(
        new ApiResponse(200,collection,"Collection Image Updated Successfully !! ")
    );

});

const updateSubCollectionImage = asyncHandler(async(req,res) => {

    const {subcollectionID} = req.body;

    const subcollectionImgLocalPath = req.files?.subCollectionImage[0]?.path;

    if(!subcollectionImgLocalPath)  throw new ApiError(400,"subCollectionImage is required ! ");
          
    const subCollectionImage = await uploadOnCloudinary(subcollectionImgLocalPath);
          
    if(!subCollectionImage) throw new ApiError(400,"Error in uploading subCollectionImage on Cloudinary ! ");
    

    const subcollection = await User.findByIdAndUpdate(
        subcollectionID,
        {
            $set:{  

                subCollectionImage:subCollectionImage.url
            }
        },
        {
            new:true
        }
    );

    return res.status(200)
    .json(
        new ApiResponse(200,subcollection,"Sub Collection Image Updated Successfully !! ")
    );

});


export {
    addCollection,
    addSubCollection,
    addProductToSubCollection,
    deleteCollection,
    deleteSubCollection,
    removeProductFromSubCollection,
    removeSubCollectionFromCollection,
    updateCollectionImage,
    updateSubCollectionImage

}