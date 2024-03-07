"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Middleware = (req, res, next) => {
    // Get the token from the header
    const token = req.headers.authorization;
    if (!token) {
        return res.json({ msg: "No token , authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT);
        req.body.user = decoded.user;
        next();
    }
    catch (error) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
exports.default = Middleware;
