import mongoose from "mongoose";
import Product from "./productModel.js";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        images: [{ type: String, required: true}],
        price: { type: Number, required: true },
        size: {
          type: String,
          required: true,
          default: "S",
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      //result come from paypall
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    discountPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    size: {
      type: String,
      required: true,
      default: "S",
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", async function (next) {
  try {
    for (const orderItem of this.orderItems) {
      const product = await Product.findById(orderItem.product);

      if (product) {
        product.countInStock -= orderItem.qty;
        await product.save();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const discountSchema = mongoose.Schema({
  rate: {
    type: Number,
    required: true,
    default: 0.1,
  },
});

export const Discount = mongoose.model("Discount", discountSchema);

// export default Discount;

const Order = mongoose.model("Order", orderSchema);

export default Order;
