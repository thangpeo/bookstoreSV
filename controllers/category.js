const express = require("express");
const { default: mongoose } = require("mongoose");
const { categoryModel } = require("../models/category");
const productModel = require("../models/product");
const { typeModel } = require("../models/type");

const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
  try {
    // const categories = await categoryModel.aggregate([
    //     // { $addFields: { "nameLower": { $toLower: "$name" } } },
    //     {
    //         $lookup: {
    //             from: "products",
    //             // let: { "name": "$nameLower" },
    //             let: { "id": "$_id" },
    //             pipeline: [
    //                 // { "$addFields": { "category": { "$toLower": "$category" } } },
    //                 { $match: { $expr: { $eq: ["$$id", "$category_id"] } } }
    //             ],
    //             as: "products",
    //         }
    //     },
    //     {
    //         $project: {
    //             name: 1,
    //             types: 1,
    //             displayImage: { $first: {$first: "$products.images.src"} }
    //         }
    //     }
    // ])

    // res.status(200).json(categories)

    // dung ref thi import model tuong ung voi ref
    const [...categories] = await categoryModel.find().populate("types").lean();
    const n = categories.length;
    for (let index = 0; index < n; index++) {
      const category = categories[index];
      const product = await productModel.findOne({
        categoryId: mongoose.Types.ObjectId(category._id),
      });
      category.product = product;
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});
categoryRouter.get("/test", async (req, res) => {
  try {
    const categories = await categoryModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "category.name",
          foreignField: "name",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          _id: 1,
        },
      },
    ]);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

categoryRouter.post("/", async (req, res) => {
  try {
    const category = new categoryModel(req.body);
    await category.save((err) => {
      if (err) res.status(400).json(err);
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
});

categoryRouter.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json();
    }
    await categoryModel.findByIdAndRemove(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(400).json(error);
  }
});
categoryRouter.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json();
    }
    const category = req.body;
    await categoryModel.findByIdAndUpdate(req.params.id, category);
    res.status(204).json();
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = categoryRouter;
