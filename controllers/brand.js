const express = require('express')
const { default: mongoose } = require('mongoose')
const {brandModel} = require('../models/brand')


const brandRouter = express.Router()

brandRouter.get('/', async (req, res)=>{
    try {
        const brands= await brandModel.find()
        res.status(200).json(brands)
    } catch (error) {
        res.status(500).json(error)
    }
})

brandRouter.post('/', async (req, res)=>{
    try {
        const createBrand = new brandModel(req.body)
        res.status(200).json(createBrand)
        await createBrand.save()
    } catch (error) {
        res.status(400).json(error)
    }
})

brandRouter.delete('/:id', async (req, res)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json()
        }
        const brand = await brandModel.findByIdAndDelete(req.params.id, (err)=>{
            if(err)
                res.status(400).json(error)
        })
        res.status(200).json(brand)
    } catch (error) {
        res.status(400).json(error)
    }
})
brandRouter.put('/:id', async (req, res)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json()
        }
        const brand = req.body
        await brandModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json(brand)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = brandRouter