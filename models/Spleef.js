const mongoose = require("mongoose")

const spleefSchema = mongoose.Schema({
    number: {type:Number,required:true},
    lastSpleef:{type:Date,required:true}
})

module.exports = mongoose.model('spleef', spleefSchema)