const { default: mongoose } = require("mongoose")


const bannerChema = new mongoose.Schema({
    image: String
})
const bannerModel = mongoose.model('banner', bannerChema)
module.exports = {
    bannerChema,
    bannerModel
}