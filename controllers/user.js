const express = require('express')
const { default: mongoose } = require('mongoose')
const { userModel } = require('../models/user')
const bcrypt = require('bcrypt');

const saltRounds = 10;
const userRouter = express.Router()

userRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await userModel.findOne({ username: username})
        if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
                if(err || !result){
                    res.status(404).json()
                }else {
                    const {userInfo,password} = user
                    res.status(200).json(userInfo)
                }
            });
            
        } else {
            res.status(404).json()
        }
    } catch (error) {
        res.status(500).json(error)
    }
})
userRouter.post("/register", async (req, res) => {
    try {
        const { username, password, firstName = '', lastName = '' } = req.body
        const oldUser = await userModel.findOne({ username: username })
        if (oldUser) {
            res.status(400).json()
        } else {
            if (username && password) {
                bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
                    if(err){
                        res.status(400).json()
                    }else{
                        const user = new userModel({ username, password: hash, firstName, lastName })
                        await user.save()
                        res.status(200).json({ username, firstName, lastName })
                    }
                });
            } else {
                res.status(400).json()
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

userRouter.post("/", async (req, res) => {
    try {
        const { username } = req.body
        const user = await userModel.findOne({ username: username })
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json()
        }
    } catch (error) {
        res.status(500).json()
    }
})
userRouter.patch("/update", async (req, res) => {
    try {
        await userModel.findOneAndUpdate({ username: req.body.username }, res.body, { new: true })
        res.status(204).json(req.body)
    } catch (error) {
        res.status(500).json()
    }
})

module.exports = userRouter
