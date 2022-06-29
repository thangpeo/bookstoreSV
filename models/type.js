const { default: mongoose } = require("mongoose");

const typeSchema = new mongoose.Schema({
    name: String
})

const typeModel = mongoose.model('type', typeSchema)
module.exports = {
    typeSchema,
    typeModel,
}