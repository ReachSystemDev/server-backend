import { Schema,model } from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema =  new Schema({
    username:{
        type: String,
        // unique: true
        unique: false
    },
    name:{
        type: String,
        // unique: true
        unique: false
    },
    lastname:{
        type: String,
        // unique: true
        unique: false
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false
    },
    active: {
        type: Boolean
    },
    avatar:{
        type: String,
        required: false
    }

},{
    timestamps: true,
    versionKey: false
})

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePassword = async (password, recivedPassword) => {
    return await bcrypt.compare(password,recivedPassword)
}

export default model('User', userSchema)