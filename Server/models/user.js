const mongoose =  require('mongoose')
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    date : {
        type : Date,
        default : Date.now
    }
});
module.exports = mongoose.model('user', userSchema);