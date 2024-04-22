import mongoose from "mongoose";


const productSchema = new mongoose.Schema({

    productName: {
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,   // due to index the searching becomes more optimised so though it is expensive its worth while
    },
    Description: {
        type:String,
        required: true,
        trim: true,
        index: true,
    },
    productImage:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        required:true,
        default:0
    }
    
},{timestamps:true});


export const Product = mongoose.model('Product',productSchema);