const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        minLenght: 3,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'}
]
})

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;