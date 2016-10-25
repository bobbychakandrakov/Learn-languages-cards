var mongoose = require('mongoose');

var wordSchema = new mongoose.Schema({
    eName: {
        type: String,
        required: true
    },
    bName: {
        type: String,
        required: true
    }

});

//exports Project model.
module.exports = mongoose.model('Word',wordSchema);
