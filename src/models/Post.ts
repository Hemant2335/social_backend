import mongoose from "mongoose";
import { Schema } from "mongoose";


const Post = new Schema({
    Title : {type: String , required : true},
    Content : {type: String , required : true},
    Author : {type: Schema.Types.ObjectId , ref : 'User'},
    Comments : [{type: Schema.Types.ObjectId , ref : 'Comment'}],
    Likes : [{type: Schema.Types.ObjectId , ref : 'User'}]
})

export default mongoose.model('Post' , Post) ;