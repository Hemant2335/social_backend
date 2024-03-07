import mongoose from "mongoose";
import { Schema } from "mongoose";

const Userschema = new Schema({
    Name : {type: String , required : true},
    Email : {type: String , required : true , unique : true},
    Password : {type: String , required : true},
    Posts : [{type: Schema.Types.ObjectId , ref : 'Post'}]
}) ;

const User = mongoose.model('User' , Userschema ) ;

export default User;