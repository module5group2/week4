
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const saltRounds = bcrypt.genSaltSync();
const PASSWORD_PATTERN = /^.{8,}$/;

function validateEmail(email) {
    var re = /^.+@(?:[\w-]+\.)+\w+$/;
    return re.test(email)
};

const UserSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: /^.+@(?:[\w-]+\.)+\w+$/,
    },
    password: {
        type: String,
        required: true,
        match: [PASSWORD_PATTERN, 'the password is invalid']
    },
    bio: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    avatar: {
        type: String,
        required: 'avatar is required'
    }
},
{
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
        
            return ret
        }
    },
    toObject: {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret
        }
    }
});

UserSchema.pre('save', function(next){
    now = new Date();
    this.updatedAt = now;
    if(!this.createdAt){
        this.createdAt = now;
    }
    console.log('Antes')
    console.log(this.isModified('password'))
    if (this.isModified('password')) {
        bcrypt.hash(this.password, saltRounds).then((hash) => {
            console.log(`hash ${hash}`)
            this.password = hash;
            console.log(`this.password ${this.password}`)
            next();
        });
    } else{
        next();
    }
    
});

UserSchema.methods.checkPassword = async function (passwordToCheck) {
    console.log(`passwordToCheck ${passwordToCheck}...`)
    console.log(`password ${this.password}...`)
    return await bcrypt.compare(passwordToCheck, this.password);
  };



const User = mongoose.model('User', UserSchema);
module.exports = User;