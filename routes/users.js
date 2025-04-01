import express from "express";
import { Sequelize, ValidationError } from "sequelize";
import { body,param,validationResult } from "express-validator";

import db from "../models/index.js"; 

const {Post,User } = db;  

var router = express.Router();

const validationErrormiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


const updatevalidation = [
  param('id').isInt().withMessage('Invalid user ID'),
  body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('age').isInt({ min: 1 }).withMessage('Age must be a positive integer'),
  body('posts').optional().isArray().withMessage('Posts must be an array'),
  body('posts.*.id').optional().notEmpty().withMessage('Post ID is required'),
  body('posts.*').if(body('posts').exists()).custom(post => {
      if (!post.title && !post.content) {throw new Error('Either title or content is required');}
      return true;
  }),
  body('posts.*.title').optional().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('posts.*.content').optional().isLength({ min: 10, max: 500 }).withMessage('Content must be between 10 and 500 characters'),
];

// routers
router.get("/", async (req, res) => {
  try {
    console.log(typeof User);
    console.log(User instanceof Sequelize.Model);
    console.log(User);
    
    const users = await User.findAll({
      include: [{
          model: Post,
          attributes: ["id", "title", "content"],
          as :"posts"
      },],
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/:id", 
  [param('id').isInt().withMessage('Invalid user ID'),],validationErrormiddleware,
  async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findByPk(id, {
      include: [{
          model: Post,
          attributes: ["id", "title", "content"],
          as :"posts"
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


router.post("/",
  [
    body("name").notEmpty().isString().isLength({ min: 3 }).trim().escape().withMessage("enter a valid name"),
    body("email").notEmpty().isEmail().trim().normalizeEmail().withMessage("enter a validemail"),
    body("age").notEmpty().isInt({min:1}).withMessage("enter a valid age"),
  ],
  validationErrormiddleware,
  async (req, res) => {
    try {
      const { name, email, age } = req.body;
      const user = await User.create({ name, email, age });
      res.status(201).json({ data: user });
    } catch (error) {
      console.log("user post method error message", error);
      res.status(500).json({ error: error.message });
    }
  }
);


router.put("/:id", updatevalidation,validationErrormiddleware, async (req, res) => {
  try {
    const { name, email, age, posts } = req.body;
    const id = parseInt(req.params.id);

    const user = await User.findByPk(id, {
      include: [{ model: Post,as:"posts" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.update({ name, email, age }, { where: { id } });
    if (Array.isArray(posts) && posts.length > 0) {
      for (const post of posts) {
        await Post.update(
          { title: post.title, content: post.content },
          { where: { id: post.id, userId: id } }
        );
      }
    }
    const updatedUser = await User.findByPk(id, {
      include: [{ model: Post ,as :"posts"}],
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:id",
  [param('id').isInt().withMessage('Invalid user ID')],validationErrormiddleware, 
  async (req, res) => {
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
