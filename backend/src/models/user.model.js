import mongoose from "mongoose";
import Jwt from "jsonwebtoken";  // jwt is required to encrypt some data
import bcrypt from "bcrypt";   // required to encrypt the password and to decrypt it as well to keep is protected


const userSchema = new mongoose.Schema({

    username: {
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,   // due to index the searching becomes more optimised so though it is expensive its worth while
    },
    phoneNumber: {
        type:Number,
        required:true,
        unique:true
    },
    email: {
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    address:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true,'Password is Required '],
    },
    refreshToken: {
        type: String,
    },
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Order'
        }
    ],
    wishList:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
    
},{timestamps:true});

// call back is written like function() { ... } because we want to 
// access the properties of the current instance calling function 
// () => { ... } this callback does not give access to current ......
// basically access of this refrence this.username , this.password


userSchema.pre("save", async function (next) {   

    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();

} );

userSchema.methods.isPasswordCorrect = async function(password) {

    return await bcrypt.compare(password,this.password);   // checks if password send by user is same as its actual password saved in database
};

userSchema.methods.generateAccessToken = function() {

    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            address:this.address
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {

    return Jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.verifyAdmin = function() {
    if(this.role === "admin") return 1;
    return 0;
}

//  pre middleware is used when one want to run some functionality just before saving 
// the data in database like encrypting the password before saving it 
// pre can be used before saving,updating,deleting etc 

export const User = mongoose.model('User',userSchema);