const express = require("express");
const {
    addPost,
    getPosts,
    getSinglePost,
    updatePostAnswer,
} = require("./posts.controller");
const {
    validatePostMiddleware,
    validateGetPostsMiddleware,
} = require("./posts.middleware");
const router = express.Router();
// const topicsDetails = require("../../../configs/other.details");
const { Movies } = require("./posts.model");

const { Post } = require("./posts.model");

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

        console.log(sub, topic, page, limit);

        // console.log(Post);

        const data = await Post.find({})
            .skip((page - 1) * limit)
            .limit(limit);

        console.log(data);
        // const data = await Movies.find({})
        //     .select({ plot: 1, genres: 1, _id: 0 })
        //     .skip((page - 1) * limit)
        //     .limit(limit);
        const totalData = await Post.find({}).count();

        console.log(page, limit, totalData);
        res.send({ data, totalData });
    } catch (error) {
        console.log(error);
    }
});

router.post("/add", validatePostMiddleware, addPost);

router.post("/addanswer", updatePostAnswer);

router.get("/:id", getSinglePost);

// router.get("/all", postController.getAll);

module.exports = router;
