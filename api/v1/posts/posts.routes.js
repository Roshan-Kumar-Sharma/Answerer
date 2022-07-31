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

const { Post } = require("./posts.model");

router.get("/", validateGetPostsMiddleware, getPosts);

router.get("/fetch", async (req, res, next) => {
    try {
        const { sub, topic, answered } = req.query;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        console.log(sub, topic, page, limit, answered);

        // console.log(Post);
        let data, totalData;

        if (answered === "false") {
            data = await Post.find({
                is_answered: answered,
            })
                .skip((page - 1) * limit)
                .limit(limit);

            totalData = await Post.find({
                is_answered: answered,
            }).count();
        } else if (answered === "true") {
            data = await Post.find({
                subject: sub,
                topic: topic,
                is_answered: answered,
            })
                .skip((page - 1) * limit)
                .limit(limit);

            totalData = await Post.find({
                subject: sub,
                topic: topic,
                is_answered: answered,
            }).count();
        } else {
            throw Error("Invalid request");
        }

        console.log(data);

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
