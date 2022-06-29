const express = require('express')
const { default: mongoose } = require('mongoose')
const {bannerModel} = require('../models/banner')


const bannerRouter = express.Router()

bannerRouter.get('/', async (req, res)=>{
    try {
        const banners= await bannerModel.find()
        res.status(200).json(banners)
    } catch (error) {
        res.status(500).json(error)
    }
})

bannerRouter.post('/', async (req, res)=>{
    try {
        const createbanner = new bannerModel(req.body)
        res.status(200).json(createbanner)
        await createbanner.save()
    } catch (error) {
        res.status(400).json(error)
    }
})

bannerRouter.delete('/:id', async (req, res)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json()
        }
        const banner = await bannerModel.findByIdAndDelete(req.params.id, (err)=>{
            if(err)
                res.status(400).json(error)
        })
        res.status(200).json(banner)
    } catch (error) {
        res.status(400).json(error)
    }
})
bannerRouter.put('/:id', async (req, res)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json()
        }
        const banner = req.body
        await bannerModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json(banner)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = bannerRouter