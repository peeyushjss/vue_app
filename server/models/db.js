module.exports = function() {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/vueSampleApp');

    var conn = mongoose.connection;

    var model_schema_users = mongoose.Schema({
        name: String,
        email: String,
        password: String,
        mobile: Number,
        address: String
    });
    var CollectionModel_users = conn.model('users', model_schema_users);

    conn.on('error', function(err) {
        if (err)
            process.exit();
    });

    return function(req, res, next) {
        req.mongo = conn;
        req.users = CollectionModel_users;
        next();
    };
};