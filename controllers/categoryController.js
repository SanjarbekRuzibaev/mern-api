import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

const createCategory = asyncHandler(async (req, res) => {
  const existingCategoryCount = await Category.countDocuments();

  if (existingCategoryCount >= 6) {
    return res.status(400).json({
      message: "Maximum category limit reached. Cannot create more categories.",
    });
  }

  const { name, priceRange } = req.body;
  const category = new Category({
    name,
    priceRange,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

const getCategories = asyncHandler(async (req, res) => {
  const pageSize = 10;
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

  const count = await Category.countDocuments({ ...keyword });
  const categories = await Category.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1)); //get 2 products
  res.json({ categories, page, pages: Math.ceil(count / pageSize) });
});

// const deleteCategory = asyncHandler(async (req, res) => {
//   const category = await Category.findById(req.params.id);

//   if (category) {
//     await category.remove();
//     res.json({ message: "Product removed" });
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// });

const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  // Find and delete products associated with the category
  await Product.deleteMany({ categoryId: categoryId });

  // Remove the category
  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({ message: "Category and associated products removed" });
});

export { createCategory, getCategories, deleteCategory };
