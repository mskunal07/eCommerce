import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();
 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json( { limit: "16kb" } ));
app.use(express.urlencoded( { extended: true, limit: "16kb" } ));
app.use(express.static("public"));
app.use(cookieParser());

// Parse URL-encoded bodies (form data)
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (JSON data)
app.use(bodyParser.json());



import userRoute from "./routes/user.routes.js"
import productRoute from "./routes/product.routes.js"
import orderRoute from "./routes/order.routes.js"
import collectionRoute from "./routes/collection.route.js"

app.use("/api/v1/users",userRoute);
app.use("/api/v1/products",productRoute);
app.use("/api/v1/order",orderRoute);
app.use("/api/v1/collection",collectionRoute);

//   http://localhost:8000/api/v1/users/Register


export { app };