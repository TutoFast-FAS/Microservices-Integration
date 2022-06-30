const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TutorSchema = new Schema({
    name: String,
    desc: String,
    banner: String,
    type: String,
    unit: Number,
    price: Number,
    available: Boolean,
    suplier: String
});

module.exports = mongoose.model('tutor', TutorSchema);