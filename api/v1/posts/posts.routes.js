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
const _ = require("lodash");

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

        let query = Post.find();

        if (answered === "false") {
            query = query.where({ is_answered: false });
        } else if (answered === "true") {
            if(sub !== undefined) {
                query = query.where('subject', _.toLower(sub));
            }
            if(topic !== undefined) {
                query = query.where('topic', _.toLower(topic));
            }

            query = query.where({
                is_answered: true,
            });
        } else {
            throw Error("Invalid request");
        }

        // Query which counts the total number of questions
        // which have subject=sub and topic=topic
        const counterQuery = query.clone();

        query = query
            .skip((page - 1) * limit)
            .limit(limit);

        data = await query.exec();
        totalData = await counterQuery.count()
            .catch(error => 0);

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
