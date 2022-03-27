const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String, 
        require: true,
        unique: true
    }
});
// plugin adds UserSchema username,password,salt field
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);