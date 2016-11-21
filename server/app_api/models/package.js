var mongoose = require('mongoose');

var packageSchema = new mongoose.Schema({
    themeId: {
        type: String

    },
    packageCode: {
        type: String

    },
    name:{
        type:String
    }
});


module.exports = mongoose.model('Package', packageSchema);
