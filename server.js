//it would be entry point to our server

// const express = require('express')
import path from "path";
import express from "express"; //ES Modules
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from 'cors'
import pkg from 'express-fileupload'
const fileUpload = pkg
import cloudinary from 'cloudinary'

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
//db connectivity file
import connectDB from "./config/db.js";

//when i take data from backend
//import products from './data/products.js'

//backend routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
// Cloudinary configuration settings
// This will be fetched from the .env file in the root directory
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

connectDB();
const app = express();
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
  })
)

app.use(cors())



if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //it gives us the http methods and status
}
//middleware
app.use(express.json()); //it will allows us to access json data

//mounting
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes);

//when we are ready to make our payment then we will hit this route and will fetch the client id
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID),
);

// const __dirname = path.resolve(); //there is need to mimic it because __dirname is not available
// app.use("/uploads", express.static(path.join(__dirname, "/uploads"))); //join used to get the different segment of files

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/build"))); //make it static folder

//   app.get(
//     "*",
//     (
//       req,
//       res, //* means any things that is in about routes inside app.use
//     ) =>
//       res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")), //if above routes not exist then it points towards index.html
//   );
// } else {
//   //backend routes
//   app.get("/", (req, res) => {
//     res.send("API is running....");
//   });
// }
 //backend routes
 app.get("/", (req, res) => {
  res.send("API is running....");
});

//I also need this fallback for 404 errors
app.use(notFound);

//Error Middleware
//Now the error format will be below instead of html
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
//node env would be development or production
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
      .yellow.bold,
  ),
);
