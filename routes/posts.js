import express from "express";

import {Users} from "../models/users.js"
import {Posts} from "../models/posts.js"

var router = express.Router();

router.get("/", async (req, res) => {
    try {
        const posts = await Posts.findAll();
        if (!posts || posts.length === 0) {
            return res.status(200).json({ msg: "No posts found", posts: [] });
        }
        res.status(200).json(posts);

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ err: "Internal Server Error", details: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, content, userid } = req.body;
        if (!title || !content || !userid) {
            return res.status(400).json({ msg: "Title, content, and userid are required" });
        }
        const newPost = await Posts.create({ title, content, userid });
        res.status(201).json({
            msg: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        console.error("Post Creation Error:", error);
        res.status(500).json({ err: "Internal Server Error", details: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, content, userid } = req.body;
        const id = parseInt(req.params.id, 10);
        const post = await Posts.findByPk(id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        const updatedTitle = title ?? post.title;
        const updatedContent = content ?? post.content;
        const updatedUserId = userid ?? post.userid;

        const [updatedRows] = await Posts.update(
            { title: updatedTitle, content: updatedContent, userid: updatedUserId },
            { where: { id } }
        );

        if (updatedRows === 1) {
            return res.status(200).json({ msg: `Post with ID ${id} updated successfully!` });
        } else {
            return res.status(400).json({ msg: "No changes made to the post!" });
        }

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ err: "Internal Server Error", details: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ msg: "Invalid ID format" });
        }
        const post = await Posts.findByPk(id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        await post.destroy();
        res.status(200).json({ msg: `Post with ID ${id} deleted successfully!` });

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ err: "Internal Server Error", details: error.message });
    }
});

export default router;