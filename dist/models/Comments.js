"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const Comment = new mongoose_2.Schema({
    Content: { type: String, required: true },
    Author: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
});
exports.default = mongoose_1.default.model('Comment', Comment);
