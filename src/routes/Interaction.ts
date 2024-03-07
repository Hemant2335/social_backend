import express from "express";
import Comments from "../models/Comments";
import Post from "../models/Post";
import Middleware from "../middlewares/Middleware";
const router = express.Router();


// Route 1 : To Create a Comment PORT : api/intract/createcomment

router.post("/comment", Middleware, async (req, res) => {
    const { Content, PostId } = req.body;
    try {
        const comment = await Comments.create({
        Content,
        Post: PostId,
        Author: req.body.user.id,
        });
        const post = await Post.findById(PostId);
        post?.Comments.push(comment.id);
        await post?.save();
        
        res.status(200).json({ msg: "Comment Created", comment });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
})

// Route 2 : To Like a Post PORT : api/intract/like

router.post("/like", Middleware, async (req, res) => {
    const { PostId } = req.body;
    try {
        const post = await Post.findById(PostId);
        if (post && post.Likes.includes(req.body.user.id)) {
            return res.status(400).json({ msg: "Already Liked" });
        }
        post?.Likes.push(req.body.user.id);
        await post?.save();
        res.status(200).json({ msg: "Post Liked" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
})

module.exports = router;