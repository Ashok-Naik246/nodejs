const router = require("express").Router();

const Posts = require("../models/Posts");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const newPost = new Posts(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (req.body.userId === req.params.id) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("Only you can uodate your post");
    }
  } catch (error) {
    res.status(500).json("Post cant be updated");
  }
});

//de;ete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (req.body.userId === req.params.id) {
      await post.deleteOne();
      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("Only you can delete your post");
    }
  } catch (error) {
    res.status(500).json("Post cant be deleted");
  }
});

//like / deslike post
router.put("/:id/like-deslike", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post Liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post disliked");
    }
  } catch (error) {
    res.status(500).json("Post cant be deleted");
  }
});

//get post

router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
