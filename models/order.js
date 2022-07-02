const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
    username: String,
    status: {type: String, default: 'Đang chờ'},
    totalPrice: Number,
    createAt: {type: Date, default: new Date()},
    items: [
        {
            _id: mongoose.Types.ObjectId,
            name: String,
            quantity: Number,
            price: Number,
            discount: Number,
        }
    ],
    shippingAddress: {
        country: String,
        province: String,
        district: String,
        ward: String,
        address: String
    }
})

const orderModel = mongoose.model('order', orderSchema)
module.exports = {
    orderModel
}