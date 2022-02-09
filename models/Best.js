const mongoose = require('mongoose')

const bestSchema = mongoose.Schema({
    number: { type: Number, required: true },
    date: { type: String, required: true, unique: true, dropDups: true}
})

module.exports = mongoose.model('best', bestSchema)