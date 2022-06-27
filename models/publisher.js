const { default: mongoose } = require("mongoose")


const publisherSchema = new mongoose.Schema({
    name: String
})
const publisherModel = mongoose.model('publisher', publisherSchema)
module.exports = {
    publisherSchema,
    publisherModel
}