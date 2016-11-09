var mongoose = require('mongoose');

var wordSchema = new mongoose.Schema({
    eName: {
        type: String,
        required: true
    },
    bName: {
        type: String,
        required: true
    },
    imagePath: {
        type: String

    },
    maleVoice: {
        type: String
    },
    femaleVoice: {
        type: String
    }

});


module.exports = mongoose.model('Word', wordSchema);
