const { default: mongoose } = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: String,
    types: [{type: mongoose.Types.ObjectId, ref: 'type'}]
})

const categoryModel = mongoose.model('category', categorySchema)
module.exports = {
    categorySchema,
    categoryModel
}
