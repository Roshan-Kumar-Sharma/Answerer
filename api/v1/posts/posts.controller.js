const express = require("express");
const { Post, Unanswered } = require("./posts.model");

module.exports.addPost = async (req, res, next) => {
    console.log("i'm post controller");
    try {
        let post;
        if (req.body.answers.length) post = new Post(req.body);
        else post = new Unanswered(req.body);
        await post.save();
        console.log(post);
        res.send("post added successfully");
    } catch (err) {
        next(err);
    }
};
