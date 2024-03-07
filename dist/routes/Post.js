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
const Post_1 = __importDefault(require("../models/Post"));
const Middleware_1 = __importDefault(require("../middlewares/Middleware"));
const router = express_1.default.Router();
// Route 1 : To Create a Post PORT : api/post/createpost
router.post("/createpost", Middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Title, Content } = req.body;
    try {
        const post = yield Post_1.default.create({
            Title,
            Content,
            Author: req.body.user.id,
            Comments: [],
            Likes: [],
        });
        res.status(200).json({ Check: true, msg: "Post Created", post });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
router.get("/allpost", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find()
            .populate("Author", "Name")
            .populate({
            path: "Comments",
            select: "Author Content",
            populate: {
                path: "Author",
                select: "Name",
            },
        })
            .populate("Likes", "Name");
        res.status(200).json({ posts });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
router.get("/mypost", Middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find({ Author: req.body.user.id })
            .populate("Author", "Name")
            .populate({
            path: "Comments",
            select: "Author Content",
            populate: {
                path: "Author",
                select: "Name",
            },
        })
            .populate("Likes", "Name");
        res.status(200).json({ posts });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
// Route 3 : route to update the post PORT : api/post/updatepost
router.put("/updatepost/:id", Middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { Title, Content } = req.body;
    try {
        let post = yield Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: "No Post Found" });
        }
        if (post && ((_a = post.Author) === null || _a === void 0 ? void 0 : _a.toString()) !== req.body.user.id) {
            return res.status(401).json({ msg: "Not Authorized" });
        }
        post.Title = Title;
        post.Content = Content;
        yield post.save();
        res.status(200).json({ Check: true, msg: "Post Updated", post });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
// Route 4 : route to delete the post PORT : api/post/deletepost
router.delete("/deletepost/:id", Middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let post = yield Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: "No Post Found" });
        }
        if (post && ((_b = post.Author) === null || _b === void 0 ? void 0 : _b.toString()) !== req.body.user.id) {
            return res.status(401).json({ msg: "Not Authorized" });
        }
        yield post.deleteOne();
        res.status(200).json({ Check: true, msg: "Post Deleted" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
module.exports = router;
