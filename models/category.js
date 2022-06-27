const { default: mongoose } = require("mongoose");

const typeSchema = new mongoose.Schema({
    name: String
})

const categorySchema = new mongoose.Schema({
    name: String,
    types: [typeSchema]
})

const categoryModel = mongoose.model('category', categorySchema)
module.exports = {
    typeSchema,
    categorySchema,
    categoryModel
}