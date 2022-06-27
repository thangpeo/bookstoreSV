const mongoose = require("mongoose");
const { typeSchema } = require("./category");
const { genreSchema } = require("./genre");

const commentSchema = new mongoose.Schema({
  rate: Number,
  comment: String,
  displayName: String,
  date: {
    default: Date.now,
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
        genreId: mongoose.Types.ObjectId,
        ref: "genre",
      },
    ],
    isDelete: {
      type: Boolean,
      default: false,
    },
    SKUs: [
      {
        originalPrice: { type: Number },
        price: { type: Number },
        quantity: { type: Number },
        createAt: { type: Date, default: Date.now },
      },
    ],
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
