const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name:
    {
        type:String,
    },
    last_name: {
        type:String,
        required : true,
        unique: true,
    },
    email: {
        type:String,
        required : true,
    },
    gender: {
        type:String,
        required : true,
    }
})

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;