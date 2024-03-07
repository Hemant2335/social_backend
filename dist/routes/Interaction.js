"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Comments_1 = __importDefault(require("../models/Comments"));
const Post_1 = __importDefault(require("../models/Post"));
const Middleware_1 = __importDefault(require("../middlewares/Middleware"));
const router = express_1.default.Router();
// Route 1 : To Create a Comment PORT : api/intract/createcomment
router.post("/comment", Middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Content, PostId } = req.body;
    try {
        const comment = yield Comments_1.default.create({
            Content,
            Post: PostId,
            Author: req.body.user.id,
        });
        const post = yield Post_1.default.findById(PostId);
        post === null || post === void 0 ? void 0 : post.Comments.push(comment.id);
        yield (post === null || post === void 0 ? void 0 : post.save());
        res.status(200).json({ Check: true, msg: "Comment Created", comment });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
// Route 2 : To Like a Post PORT : api/intract/like
router.post("/like", Middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PostId } = req.body;
        if (!PostId)
            return res.status(400).json({ msg: "PostId is required" });
        const post = yield Post_1.default.findById(PostId);
        if (post && post.Likes.includes(req.body.user.id)) {
            return res.status(200).json({ Check: true, msg: "Already Liked" });
        }
        post === null || post === void 0 ? void 0 : post.Likes.push(req.body.user.id);
        yield (post === null || post === void 0 ? void 0 : post.save());
        res.status(200).json({ Check: true, msg: "Post Liked" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
module.exports = router;
