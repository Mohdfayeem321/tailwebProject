const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type:String,
        required:true,
        trim:true
    },
    marks: {
        type:Number,
        required:true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'user'
    },

    deletedAt: {
        type: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamp: true })

module.exports = mongoose.model('student', studentSchema)