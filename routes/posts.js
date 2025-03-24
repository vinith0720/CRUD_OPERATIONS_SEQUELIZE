import express from "express";

import Users from "../models/users.js"
import Posts from "../models/posts.js"

var router = express.Router();

router.get("/", async (req,res) => {

    try {
        const post = await posts.findall();
        
    } catch (error) {
            res.status(500).json({ "err": error})
    }
    
});

router.post("/", async (req,res) => {

    try {
        const {title,content,userid} = req.body;
        const newpost = await Posts.create({title,content,userid});
        res.status(201).json(newpost);
    } catch (error) {
        res.status(500).json({ "err": error})
    }
    
});

router.put("/", async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ "err": error})
    }
    
});

router.delete("/:id",async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ "err": error})
    }
    
})

export default router;