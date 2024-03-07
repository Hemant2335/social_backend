"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const Userschema = new mongoose_2.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Posts: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Post' }]
});
const User = mongoose_1.default.model('User', Userschema);
exports.default = User;
