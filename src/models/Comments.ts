import mongoose from "mongoose";
import { Schema } from "mongoose";


const Comment = new Schema({
    Content : {type: String , required : true},
    Author : {type: Schema.Types.ObjectId , ref : 'User'},
})


export default mongoose.model('Comment' , Comment) ;