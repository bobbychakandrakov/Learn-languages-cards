var mongoose = require('mongoose');
var gracefulShutdown;
//URL for Mongo Database
var dbURI = 'mongodb://admin:qwerty@ds031597.mlab.com:31597/side-to-side';
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGOLAB_URI;
}
// connect to MongoDB by mongoose.connect() method.
mongoose.connect(dbURI);
/**
 * on connection-Mongoose connected to+dbURl
 * on error-Mongoose connection error+error
 * on disconnection-Mongoose disconnected
 */

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

/**
 * close connection.
 * @param {string} msg .
 * @param {callback} callback .
 */
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

//require all models
require('./word');
require('./theme');

