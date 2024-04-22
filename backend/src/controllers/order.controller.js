import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import jwt from "jsonwebtoken";
import { loginUser } from "./user.controller.js";

const createOrder = asyncHandler( async(req,res) => {

    // const newOrder = new Order(req.body);

    try{

        const {userId,products,phoneNumber,amount,address} = req.body;
        console.log(req.body);

        if(
            [userId,address].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400,"All fields are compulsory ! ");
        }

        if(!phoneNumber)  throw new ApiError(400,"All fields are compulsory ! ");

        const order = await Order.create({
            userId,
            products,
            phoneNumber,
            amount,
            address,
            orderDate:Date()
        });

        const createdOrder = await Order.findById(order._id);

       

        if(!createOrder) throw new ApiError(500,"Something went wrong while creating the order ! ");

        const user = await User.findById(userId);
        console.log("user: ",user);
        console.log(order._id);
        user.orders.push(order._id);
        await user.save();
    
        return res.status(201).json(
            new ApiResponse(200,createdOrder,"Order created !! ")
        )
    


        // const savedOrder = await newOrder.save();
        // res.status(201).json(
        //     new ApiResponse(200,savedOrder,"order saved  ")
        // );
    } catch (error) {
        throw new ApiError(500,error?.message || "Problem in saving order ! ");
    }
});

const updateOrder = asyncHandler( async(req,res) => {

    try{

        const {id,address} = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            {
                new:true
            }
           );
            return res.status(200)
            .json(
                new ApiResponse(200,updatedOrder,"Order updated Successfully !! ")
            );



    //     const updatedOrder = await Order.findByIdAndUpdate(
    //     req.params.id,
    //     {
    //         $set: req.body,
    //     },
    //     {
    //         new:true
    //     }
    //    );
    //     return res.status(200)
    //     .json(
    //         new ApiResponse(200,updatedOrder,"Order updated Successfully !! ")
    //     );

    } catch (error) {
        throw new ApiError(500,error?.message || "Problem in updating order ! ");
    }
});

const deleteOrder = asyncHandler( async(req,res)=> {

    const user = await User.findById(req.user._id);

    if(!user.verifyAdmin()) throw new ApiError(401,"You are not authorized to delete order !! ");

    try{
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        return res.status(200).json(
            new ApiResponse(200,deletedOrder,"order deleted successfully ")
        );
    } catch (err) {
        throw new ApiError(500,err?.message || "Problem in deleting order ! ");
    }
});

const  confirmeOrder = asyncHandler( async(req,res) => {

    try{

        //this api will be hit after the transaction is successful !
        const {id}= req.body;

        const confirmedOrder = await  Order.findById(id);
        confirmedOrder.status="confirmed"

        confirmedOrder.save();
        return res.status(200).json(
            new ApiResponse(200,confirmedOrder,"Order confirmed Successfully !! ")
        )
    }catch(error){
        throw new ApiError(500,error?.message || "Problem in confirming order ! ");
    }
});



export {
    createOrder,
    updateOrder,
    deleteOrder,
    confirmeOrder

}