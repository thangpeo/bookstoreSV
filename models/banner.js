const { default: mongoose } = require("mongoose")


const bannerChema = new mongoose.Schema({
    image: String,
    description: String
})
const bannerModel = mongoose.model('banner', bannerChema)
module.exports = {
    bannerChema,
    bannerModel
}