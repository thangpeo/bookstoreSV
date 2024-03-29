const express = require("express");
const { default: mongoose } = require("mongoose");
const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const userRouter = express.Router();

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username: username }).lean();
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err || !result) {
          res.status(404).json();
        } else {
          const { password, ...userInfo } = user;
          res.status(200).json(userInfo);
        }
      });
    } else {
      res.status(404).json();
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
userRouter.post("/register", async (req, res) => {
  try {
    const { username, password, firstName = "", lastName = "" } = req.body;
    const oldUser = await userModel.findOne({ username: username });
    if (oldUser) {
      res.status(400).json();
    } else {
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (err) {
          res.status(400).json();
        } else {
          const user = new userModel({
            username,
            password: hash,
            firstName,
            lastName,
          });
          await user.save();
          res.status(200).json({ username, firstName, lastName });
        }
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

userRouter.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await userModel.findOne({ username: username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    res.status(500).json();
  }
});
userRouter.put("/update", async (req, res) => {
  try {
    await userModel.findOneAndUpdate(
      { username: req.body.username },
      res.body,
      { new: true }
    );
    res.status(204).json(req.body);
  } catch (error) {
    res.status(500).json();
  }
});
userRouter.post("/shippingaddress", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await userModel.findOne({ username: username });
    if (user) {
      res.status(200).json(user.shippingAddress);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json();
  }
});
userRouter.post("/shippingaddress/add", async (req, res) => {
  try {
    const { username, ...shippingAddress } = req.body;
    console.log(username, shippingAddress);
    const user = await userModel.findOneAndUpdate(
      { username: username },
      { $push: { shippingAddress: shippingAddress } },
      {
        returnOriginal: false,
      }
    );
    if (user) {
      res.status(204).json(user);
    } else {
      res.status(404).json(user);
    }
  } catch (error) {
    res.status(500).json();
  }
});

module.exports = userRouter;
