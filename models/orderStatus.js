const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema({
    name: String
})
const orderStatusModel = mongoose.model('orderStatus', orderStatusSchema)
module.exports = {orderStatusModel, orderStatusSchema}