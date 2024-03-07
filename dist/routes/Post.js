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
        res.status(200).json({ msg: "Post Created", post });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
router.get("/allpost", Middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find().populate('Author', 'Name').populate('Comments', 'Content').populate('Likes', 'Name');
        res.status(200).json({ posts });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
}));
module.exports = router;
