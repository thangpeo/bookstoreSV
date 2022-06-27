const express = require('express')
const { default: mongoose } = require('mongoose')
const { orderModel } = require('../models/order')
const { orderStatusModel } = require('../models/orderStatus')


const orderRouter = express.Router()

orderRouter.post('/', async (req, res) => {
    try {
        const { username, limit } = req.body
        const orders = await orderModel.find({ username: { $regex: username, $options: 'i' } })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
})
orderRouter.post('/getById/:id', async (req, res) => {
    try {
        const { username, limit } = req.body
        const orders = await orderModel.find({ username: { $regex: username, $options: 'i' } })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
})

orderRouter.post('/add', async (req, res) => {
    try {
        const order = new orderModel(req.body)
        await order.save()
        res.status(200).json(order)
    } catch (error) {
        res.status(400).json(error)
    }
})

orderRouter.get('/status', async (req, res) => {
    try {
        const orderStatus = await orderStatusModel.find()
        res.status(200).json(orderStatus)
    } catch (error) {
        res.status(500).json(error)
    }
})

orderRouter.post('/status', async (req, res) => {
    try {
        const orderStatus = new orderStatusModel(req.body)
        res.status(200).json(orderStatus)
        await orderStatus.save()
    } catch (error) {
        res.status(500).json(error)
    }
})
orderRouter.put('/status/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json()
        }
        const id = req.params.id
        await orderStatusModel.findByIdAndUpdate(id)
        res.status(204).json()
    } catch (error) {
        res.status(500).json(error)
    }
})
orderRouter.delete('/status/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json()
        }
        const id = req.params.id
        await orderStatusModel.findByIdAndDelete(id)
        res.status(204).json()
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = orderRouter