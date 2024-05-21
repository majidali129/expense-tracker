import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        unique: [true, "Username needs to be unique"],
        lowercase: true,
        trim: true,
        required: [true, 'Username is required'],
        minLength: [5, 'Username must be equal or grater than 5 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        validate: {
            validator: (value) => {
                return value.includes('@')? true: false
            }
        }
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [8, 'password needs to be minimum 8 characters long']
    },
    confirmPassword: {
        type: String,
        required: [true, 'confirm password is required'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'passwords does not match'
        }
    },
    avatar: String,
    refreshtoken: String
}, {timestamps: true})

userSchema.pre('save', function(next) {
    this.confirmPassword = undefined;
    next()
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next()
})

export const User = mongoose.model('User', userSchema)