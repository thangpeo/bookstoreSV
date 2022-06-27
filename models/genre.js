const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    name: String
})
const genreModel = mongoose.model('genre', genreSchema)
module.exports = {genreModel, genreSchema}