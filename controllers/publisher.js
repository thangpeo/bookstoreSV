const express = require('express')
const { default: mongoose } = require('mongoose')
const { publisherModel } = require('../models/publisher')


const publisherRouter = express.Router()

publisherRouter.get("/", async (req, res)=> {
    try {
        const publishers = await publisherModel.find()
        res.status(200).json(publishers)
    } catch (error) {
        res.status(500).json(error) 
    }
})

publisherRouter.post("/", async (req, res)=>{
    try {
        
        const publisher = new publisherModel(req.body)
        res.status(200).json(publisher)
        await publisher.save()
        
    } catch (error) {
        res.status(500).json(error) 
    }
})
publisherRouter.delete("/:id", async (req, res)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json()
        }
        const publisher = req.body
        await publisherModel.findByIdAndDelete(req.params.id, (err)=>{
            res.status(400).json(err) 
        })
        res.status(200).json(publisher)
        
    } catch (error) {
        res.status(500).json(error) 
    }
})
publisherRouter.put("/:id", async (req, res)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json()
        }
        const publisher = req.body
        await publisherModel.findByIdAndUpdate(req.params.id, publisher, (err)=>{
            res.status(400).json(err) 
        })
        res.status(200).json(publisher)
    } catch (error) {
        res.status(500).json(error) 
    }
})

module.exports=publisherRouter