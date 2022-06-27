const { default: mongoose } = require("mongoose");

const shippingAddressSchema = new mongoose.Schema({
    province: String,
    district: String,
    ward: String,
    address: String,
    phone: {type: String, length: 10},
    receiverFullName: String,
    isDefault: Boolean
})

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    shippingAddress: [shippingAddressSchema]
})

const userModel = mongoose.model('user', userSchema)

module.exports = {
    userModel,
    userSchema,
    shippingAddressSchema
}