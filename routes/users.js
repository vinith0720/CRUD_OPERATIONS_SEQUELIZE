import express from "express";
import Users from "../models/users.js"
import posts from "../models/posts.js"

var router = express.Router();


// READ Users (GET /users)
router.get("/", async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await Users.findByPk(id);
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// CREATE User (POST /users)
router.post("/", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = await Users.create({ name, email, age });
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// UPDATE User (PUT /users/:id)
router.put("/:id", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = await Users.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Users.update({ name, email, age });
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({error: error.message });
  }
});

// DELETE User (DELETE /users/:id)
router.delete("/:id", async (req, res) => {
  try {

    const user = await Users.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.json({message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
