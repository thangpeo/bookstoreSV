const { default: mongoose } = require("mongoose")


const brandSchema = new mongoose.Schema({
    name: String
})
const brandModel = mongoose.model('brand', brandSchema)
module.exports = {
    brandSchema,
    brandModel
}