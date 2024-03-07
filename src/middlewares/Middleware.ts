import { NextFunction , Response , Request } from 'express';
require('dotenv').config();
import jwt, { JwtPayload, Secret } from   "jsonwebtoken";

const Middleware = (req : Request , res : Response , next : NextFunction) =>{
    
    // Get the token from the header
    const token = req.headers.authorization;
    if(!token){
        return res.json({msg : "No token , authorization denied"});
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT as Secret) as JwtPayload;
        req.body.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({msg : "Token is not valid"});
    }
}

export default Middleware;