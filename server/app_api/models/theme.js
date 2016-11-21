
var mongoose = require('mongoose');
var themeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    wordId: {
        type:Object
    }

});


module.exports = mongoose.model('Theme',themeSchema);
