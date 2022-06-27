const express = require('express')
const { default: mongoose } = require('mongoose')
const { genreModel } = require('../models/genre')


const genreRouter = express.Router()

genreRouter.get("/", async (req, res)=> {
    try {
        const genres = await genreModel.find()
        res.status(200).json(genres)
    } catch (error) {
        res.status(500).json(error) 
    }
})

genreRouter.post("/", async (req, res)=>{
    try {
        
        const genre = new genreModel(req.body)
        await genre.save()
        
        res.status(200).json(genre)
    } catch (error) {
        res.status(500).json(error) 
    }
})
genreRouter.delete("/:id", async (req, res)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json()
        }
        const genre = req.body
        await genreModel.findByIdAndDelete(req.params.id, (err)=>{
            res.status(400).json(err) 
        })
        res.status(200).json(genre)
        
    } catch (error) {
        res.status(500).json(error) 
    }
})
genreRouter.put("/:id", async (req, res)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json()
        }
        const genre = req.body
        await genreModel.findByIdAndUpdate(req.params.id, genre, (err)=>{
            res.status(400).json(err) 
        })
        res.status(200).json(genre)
    } catch (error) {
        res.status(500).json(error) 
    }
})

module.exports=genreRouter