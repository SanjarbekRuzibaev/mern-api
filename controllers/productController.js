import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from 'cloudinary'

//@desc  Fetch all products
//@route  Get /api/products
//@access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 16;
  const page = Number(req.query.pageNumber) || 1;
  //search functionality
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i", //case: insensitive
          //regex-->regular expression, if i write iph then it must get the complete product that's why i m using regex
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1)); //get 2 products
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc  Fetch single products
//@route  Get /api/products/:id
//@access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    // res.status(404).json({message: 'Product not found'})
    // After making custom error handeling
    res.status(404); //optional
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
// const createProduct = asyncHandler(async (req, res) => {
//   if (req.files != null && req.files.length > 0) {
//     const file = req.files.photo;
//     cloudinary.uploader
//     .upload(file.tempFilePath)
//     .then(async result => {
//       const {
//         name,
//         price,
//         description,
//         brand,
//         category,
//         categoryId,
//         countInStock,
//       } = req.body;
//       const product = new Product({
//         name: name,
//         price: price,
//         user: req.user._id, //to get the login user
//         image: result.url,
//         brand: brand,
//         category: category,
//         countInStock: countInStock,
//         numReviews: 0,
//         description: description,
//         categoryId,
//       });
    
//       const createdProduct = await product.save();
  
      
//       res.status(200).json({
//         success: true,
//         data: createdProduct,
//       })
//     })
//   } else {
//     res.status(404)
//     throw new Error('Image not found')
//   }
// });
const createProduct = asyncHandler(async (req, res) => {
  if (req.files != null) {
    const fileArray = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
    const filePromises = fileArray.map((file) => {
      return cloudinary.uploader.upload(file.tempFilePath);
    });

    const uploadedResults = await Promise.all(filePromises);

    const {
      name,
      price,
      description,
      brand,
      category,
      categoryId,
      countInStock,
    } = req.body;

    const imageUrls = uploadedResults.map((result) => result.url);

    const product = new Product({
      name: name,
      price: price,
      user: req.user._id,
      images: imageUrls, // Store image URLs in the 'images' field
      brand: brand,
      category: category,
      countInStock: countInStock,
      numReviews: 0,
      description: description,
      categoryId,
    });

    const createdProduct = await product.save();

    res.status(200).json({
      success: true,
      data: createdProduct,
    });
  } else {
    res.status(404);
    throw new Error('Images not found');
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    // product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(), //here we are checking from the array of existing users that already give review by comparing it to currently login user
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length; //to get the average

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3); //-1 means it sould sort in ascending order

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
