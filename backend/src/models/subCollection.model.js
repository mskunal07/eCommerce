import mongoose from "mongoose";


const subCollectionSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    subCollectionImage:{
        type:String
    },
    
    products:[
        {
            productId:String,
        }
    ]
},{timestamps:true});


export const subCollection = mongoose.model('subCollection',subCollectionSchema);