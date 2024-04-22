import mongoose from "mongoose";


const collectionSchema = new mongoose.Schema({

    name:{
        type:String,
        unique: true,
        required:true
    },
    
    collectionImage:{
        type:String
    },

    subcollection:[
        {
            subCollectionId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'subColleSction'
            }
        }
    ]
},{timestamps:true});


export const Collection = mongoose.model('Collection',collectionSchema);