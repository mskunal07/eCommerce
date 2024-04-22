import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({

    userId: {
        type:String,
        required: true,
        index: true,   // due to index the searching becomes more optimised so though it is expensive its worth while
    },
    products:[ 
        {
            productId:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                default:1,
            },
            price:{
                type:Number,
                default:0
            }
        },
    ],
    phoneNumber:{
        type:Number,
        required:true
    },
    orderDate:{
        type:String,
        required:true,
        default:""
    },
    amount:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type: String,
        enum: ['pending', 'confirmed'],
        default: 'pending'
    },
},{timestamps:true});


export const Order = mongoose.model('Order',orderSchema);