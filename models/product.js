const mongoose = require("mongoose");
const { typeSchema } = require("./category");
const { genreSchema } = require("./genre");

const commentSchema = new mongoose.Schema({
  rate: Number,
  comment: String,
  displayName: String,
  date: {
    default: new Date(),
    type: Date,
  },
});
const imageSchema = new mongoose.Schema({
  src: String,
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: [{ type: String }],
    description: String,
    discount: { type: Number, default: 0 },
    image: String,
    categoryId: { type: mongoose.Types.ObjectId, ref: "category" },
    typeId: { type: mongoose.Types.ObjectId, ref: "type" },
    brandId: { type: mongoose.Types.ObjectId, ref: "brand" },
    bookLayout: String,
    publisherId: { type: mongoose.Types.ObjectId, ref: "publisher" },
    genres: [
      {
        type: mongoose.Types.ObjectId,
        ref: "genre",
      },
    ],
    isDelete: {
      type: Boolean,
      default: false,
    },
    SKUs: {
      type: [
        {
          originalPrice: { type: Number, default: 0 },
          price: { type: Number, default: 0 },
          quantity: { type: Number, default: 0 },
          createAt: { type: Date, default: new Date() },
        },
      ],
      default: [
        {
          originalPrice: 0,
          price: 0,
          quantity: 0,
          createAt: new Date(),
        },
      ],
    },
    rating: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);
const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
