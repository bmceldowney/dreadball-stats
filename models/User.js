var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')
var schema = new mongoose.Schema({
    firstName: { type: String, default: '' },
    email: { type: String, default: '' },
    openId: { type: String, default: '' },
    coachName: { type: String, default: '' }
});

schema.plugin(findOrCreate);
module.exports = exports = mongoose.model('user', schema);
