import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/categoryController.js";
const router = express.Router();

router.route("/").get(getCategories).post(protect, admin, createCategory);
router.route("/:id").delete(protect, admin, deleteCategory);

export default router;
