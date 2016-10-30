
var mongoose = require('mongoose');
var themeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Theme',themeSchema);
