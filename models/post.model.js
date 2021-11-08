
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema ({
    id: {
        type: Schema.ObjectId, 
        default: function () { return new ObjectId()},
        auto: true
    },
    createdAt:{
        type: Date
    },
    updatedAt: {
        type: Date
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
});

PostSchema.pre('save', function(next){
    now = new Date();
    this.updatedAt = now;
    if(!this.createdAt){
        this.createdAt = now;
    }
    next();
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;