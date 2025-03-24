import express from "express";

import User from "../models/user.js"
import Post from "../models/post.js"

var router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
          model: Post,
          attributes: ["id", "title", "content"],
      },],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findByPk(id, {
      include: [{
          model: Post,
          attributes: ["id", "title", "content"],
        },],
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = await Users.create({ name, email, age });
    res.status(201).json({ data: user });
  } catch (error) {
    console.log("user post message",error);
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { name, email, age, posts } = req.body;
    const id = parseInt(req.params.id);

    const user = await Users.findByPk(id, {
      include: [{ model: Post }] 
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Users.update(
      { name, email, age },
      { where: { id } }
    );
    if (posts && posts.length > 0) {
      for (const post of posts) {
        await Posts.update(
          { title: post.title, content: post.content },
          { where: { id: post.id, userId: id } }
        );
      }
    }
    const updatedUser = await Users.findByPk(id, {
      include: [{ model: Post }]
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy(); 
    res.json({ message: "User and associated posts deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
