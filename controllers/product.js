const express = require("express");
const {
  getPageOffset,
  pagePagination,
  emptyOrRows,
} = require("../helpers/helper");
const productModel = require("../models/product");
const config = require("../config");

const product = require("../models/product");
const { default: mongoose } = require("mongoose");
const { categoryModel } = require("../models/category");

const productRouter = express.Router();

const productAggregate = ({ page = 1, limit = config.listPerPage }) => [
  {
    $addFields: {
      price: { $last: "$SKUs.price" },
      quantity: { $last: "$SKUs.quantity" },
    },
  },
  {
    $project: {
      SKUs: 0,
      // discount: 0
    },
  },
  {
    $facet: {
      total: [
        {
          $count: "count",
        },
      ],
      data: [
        {
          $skip: getPageOffset(page, limit),
        },
        {
          $limit: limit,
        },
      ],
    },
  },
  {
    $project: {
      productList: "$data",
      total: { $first: "$total.count" },
    },
  },
];

productRouter.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = config.listPerPage,
      category = "",
      type = "",
      author = "",
      publisher = "",
      price = "",
      brand = "",
      q = "",
    } = req.query;
    let [minPrice, maxPrice] = price.split("_");
    minPrice = Number(minPrice) || 0;
    maxPrice = Number(maxPrice) || Number.MAX_VALUE;
    // Start with: ^string
    // End with: string$
    const checkPub = publisher
      .split("_")
      .every((item) => mongoose.Types.ObjectId.isValid(item));
    const checkBrand = brand
      .split("_")
      .every((item) => mongoose.Types.ObjectId.isValid(item));

    const productFilter = [
      {
        $match: {
          name: { $regex: q, $options: "i" },
          categoryId: mongoose.Types.ObjectId.isValid(category)
            ? { $eq: mongoose.Types.ObjectId(category) }
            : { $ne: "category" },
          typeId: mongoose.Types.ObjectId.isValid(type)
            ? { $eq: mongoose.Types.ObjectId(type) }
            : { $ne: "type" },
          author: author
            ? { $regex: author.replaceAll("_", "|"), $options: "i" }
            : { $ne: "author" },
          publisherId: checkPub
            ? {
                $in: publisher
                  .split("_")
                  .map((item) => mongoose.Types.ObjectId(item)),
              }
            : { $ne: "publisher" },
          brandId: checkBrand
            ? {
                $in: brand
                  .split("_")
                  .map((item) => mongoose.Types.ObjectId(item)),
              }
            : { $ne: "brand" },
        },
      },
      {
        $addFields: {
          price: { $first: "$SKUs.price" },
          quantity: { $first: "$SKUs.quantity" },
        },
      },
      { $match: { price: { $gte: minPrice, $lte: maxPrice } } },
    ];

    const products = await productModel.aggregate([
      ...productFilter,
      ...productAggregate({ page, limit }),
    ]);
    const pagination = pagePagination(page, limit, Number(products[0].total));
    res.status(200).json({
      productList: products[0].productList,
      totalPage: pagination.lastPage,
    });

    // res.status(200).json(await productModel.find())
  } catch (error) {
    res.status(500).json(error);
  }
  next();
});

productRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json();
    }
    const product = await productModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $project: {
          comments: 0,
          isDelete: false,
        },
      },
      {
        $addFields: {
          price: { $last: "$SKUs.price" },
        },
      },
      {
        $project: {
          SKUs: 0,
        },
      },
    ]);
    if (!product) {
      return res.status(404).json();
    }
    res.status(200).json(product[0]);
  } catch (error) {
    res.status(500).json(error);
  }
  next();
});
productRouter.get("/comment/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { page = 1, limit = config.listPerPage } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json();
    }
    const comments = await productModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $unwind: "$comments" },
      {
        $facet: {
          total: [
            {
              $count: "count",
            },
          ],
          comments: [
            {
              $project: {
                comment: "$comments.comment",
                displayName: "$comments.displayName",
                rate: "$comments.rate",
              },
            },
            {
              $skip: getPageOffset(page, limit),
            },
            {
              $limit: limit,
            },
          ],
          rating: [
            {
              $group: {
                _id: "$_id",
                rateAvg: {
                  $avg: "$comments.rate",
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          rating: {
            $first: "$rating.rateAvg",
          },
          total: {
            $first: "$total.count",
          },
        },
      },
    ]);
    res.status(200).json({
      ...comments[0],
      totalPage: pagePagination(page, limit, comments[0].total).lastPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  next();
});

productRouter.post("/", async (req, res, next) => {
  try {
    const createproduct = new productModel(req.body);
    await createproduct.save();
    res.status(201).json(createproduct);
  } catch (error) {
    res.status(400).json(error);
  }
  next();
});

productRouter.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json();
    }
    await productModel.findByIdAndUpdate(req.params.id, { isDelete: true });
    res.status(204).json();
  } catch (error) {
    res.status(400).json(error);
  }
  next();
});

productRouter.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json();
    }
    const product = req.body;
    const updateproduct = await productModel.findByIdAndUpdate(
      req.params.id,
      product
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
  next();
});

productRouter.get("/category/:id", async (req, res, next) => {
  try {
    const { id, limit = config.listPerPage, page = 1 } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json([]);
    }
    const products = await productModel.aggregate([
      { $match: { "category._id": mongoose.Types.ObjectId(id) } },
      ...productAggregate({ limit }),
    ]);
    res.status(200).json(products[0]);
  } catch (error) {
    res.status(500).json(error);
  }
  next();
});
productRouter.get("/type/:id", async (req, res, next) => {
  try {
    const { id, limit = config.listPerPage } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json([]);
    }
    const products = await productModel.aggregate([
      { $match: { "type._id": mongoose.Types.ObjectId(id) } },
      ...productAggregate({ limit }),
    ]);
    res.status(200).json(products[0]);
  } catch (error) {
    res.status(500).json(error);
  }
  next();
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
productRouter.get("/abc/test", async (req, res, next) => {
  try {
    // pub.forEach(async (p) => {
    //   await productModel.updateMany(
    //     { brand: { $regex: p.name, $options: "i" } },
    //     {
    //       $set: {
    //         brand: { _id: mongoose.Types.ObjectId(p._id), name: p.name },
    //       },
    //     }
    //   );
    // });
    // const categories = await categoryModel.find().populate("types");
    // const pds = await productModel.find();
    // pds.forEach(async (p) => {
    //   const c = categories[getRandomInt(0, categories.length - 1)];
    //   await productModel.findByIdAndUpdate(p._id, {
    //     categoryId: mongoose.Types.ObjectId(c._id),
    //     typeId: mongoose.Types.ObjectId(
    //       c.types[getRandomInt(0, c.types.length - 1)]._id
    //     ),
    //   });
    // });
   const aa = await categoryModel.find().populate('products')
    res.status(200).json(aa);
  } catch (error) {
    res.status(500).json(error);
  }
  next();
});

module.exports = productRouter;
