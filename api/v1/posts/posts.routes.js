const express = require("express");
const { addPost, getPosts } = require("./posts.controller");
const {
  validatePostMiddleware,
  validateGetPostsMiddleware,
} = require("./posts.middleware");
const router = express.Router();
// const topicsDetails = require("../../../configs/other.details");
const { Movies } = require("./posts.model");

// const Post = require("./posts.model");

// router.post("/add", (req, res, next) => {
//     for (let i = 0; i < 3; i++) {
//         if (!req.body.answers[i]) {
//             req.body.answers.splice(i, i + 1);
//         }
//     }
//     console.log(req.body);
//     res.send("post submiiteed");
// });

router.get("/", validateGetPostsMiddleware, getPosts);

router.get("/fetch", async (req, res, next) => {
  try {
    const { sub, topic } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const data = await Movies.find({})
      .select({ plot: 1, genres: 1, _id: 0 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalData = await Movies.find({}).count();
    console.log(page, limit, totalData);
    res.send({ data, totalData });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/add", validatePostMiddleware, addPost);

// router.get("/all", postController.getAll);

module.exports = router;
