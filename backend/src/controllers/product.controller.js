import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler( async(req,res) => {

  const user = await User.findById(req.user._id);

  if(!user.verifyAdmin()) throw new ApiError(401,"You are not Authorized !! ");

  const {productName,Description,price,weight} = req.body;

  if(
    [productName,Description,price,weight].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400,"All fields are compulsory ! ");
    }
    
    const productImgLocalPath = req.files?.productImage[0]?.path;

    if(!productImgLocalPath)  throw new ApiError(400,"productImg is required ! ");
      
    const productImage = await uploadOnCloudinary(productImgLocalPath);
      
    if(!productImage) throw new ApiError(400,"Error in uploading Product img on Cloudinary ! ");

    const product = await Product.create({
      productName,
      Description,
      price,
      weight,
      productImage: productImage?.url
    })

    const createdProduct = await Product.findById(product._id);

    if(!createdProduct) throw new ApiError(500,"Something went wrong while Creating Product ! ");

    return res.status(201).json(
        new ApiResponse(200,createdProduct,"Product Created Successfully")
    )

});

const getProductById = asyncHandler( async(req,res)=> {

  try{
    const product = await Product.findById(req.params.id);

    if(!product) throw new ApiError(401,"Unable to fetch product invalid id ");

    return res.status(201).json(
      new ApiResponse(200,product,"product fetched")
    );
  } catch(err) {
    res.status(500).json(
      new ApiError(401,"Unable to fetch product invalid id ")
    )
  }

} );

const getallproducts = asyncHandler( async(req,res)=> {

  try{
    const products = await Product.find();
    res.status(201).json(
      new ApiResponse(200,products,"all products fetched")
    );
  } catch(err) {
    res.status(500).json(err);
  }
});




export {
    addProduct,
    getProductById,
    getallproducts
}