import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getCurrentDiscountRate,
  editDiscountRate
} from '../controllers/orderController.js'
import { protect, 
   admin,
 } from '../middleware/authMiddleware.js'

 router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
 router.route('/myorders').get(protect, getMyOrders)
 router.route('/:id').get(protect, getOrderById)
 router.route('/:id/pay').put(protect, updateOrderToPaid)
 router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)
 router.route('/discount/current').get(getCurrentDiscountRate)
 router.route('/discount/edit').put(protect, admin, editDiscountRate)


export default router
