import express from "express";
import Post from "../models/Post";
import Middleware from "../middlewares/Middleware";
const router = express.Router();

// Route 1 : To Create a Post PORT : api/post/createpost

router.post("/createpost", Middleware, async (req, res) => {
  const { Title, Content } = req.body;
  try {
    const post = await Post.create({
      Title,
      Content,
      Author: req.body.user.id,
      Comments: [],
      Likes: [],
    });
    res.status(200).json({ msg: "Post Created", post });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal error Occured");
  }
});


router.get("/allpost", Middleware, async (req, res) => {
    try {
        const posts = await Post.find().populate('Author' , 'Name').populate('Comments' , 'Author'.toUpperCase()).populate('Likes' , 'Name');
        res.status(200).json({posts});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
});

// Route 3 : route to update the post PORT : api/post/updatepost

router.put("/updatepost/:id", Middleware, async (req, res) => {
    const { Title, Content } = req.body;
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: "No Post Found" });
        }
        if (post && post.Author?.toString() !== req.body.user.id) {
            return res.status(401).json({ msg: "Not Authorized" });
        }
        post.Title = Title;
        post.Content = Content;
        await post.save();
        res.status(200).json({ msg: "Post Updated", post });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
});

// Route 4 : route to delete the post PORT : api/post/deletepost

router.delete("/deletepost/:id", Middleware, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: "No Post Found" });
        }
        if (post && post.Author?.toString() !== req.body.user.id) {
            return res.status(401).json({ msg: "Not Authorized" });
        }
        await post.deleteOne();
        res.status(200).json({ msg: "Post Deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal error Occured");
    }
})


module.exports = router;
