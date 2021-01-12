import { Schema, model } from 'mongoose'


const MenuSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    url:{
        type: String,
        required: true,
    },
    order:{
        type: Number,
        required: true,
    },
    active:{
        type: Boolean,
        required: true,
    }
},{
    timestamps: true,
    versionKey: false
})


export default model('Menu', MenuSchema)