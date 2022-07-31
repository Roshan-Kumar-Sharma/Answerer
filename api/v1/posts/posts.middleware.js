const express = require("express");
const createHttpErrors = require("http-errors");
const { createPostValidate, getPostsValidate } = require("./posts.validation");
const _ = require("lodash");

const validatePostMiddleware = async (req, res, next) => {
    console.log("I'm post middleware");
    console.log(req.body);
    try {
        for (let i = 0; i < req.body.answers.length; i++) {
            if (!req.body.answers[i]) {
                req.body.answers.splice(i, 1);
                i--;
            }
        }
        if (!req.body.answers[0]) {
            req.body.answers = [];
            req.body.is_answered = false;
        } else {
            req.body.is_answered = true;
        }
        if (!req.body.username) req.body.username = "anonymous";
        if (!req.body.rating) req.body.rating = 1;

        req.body.subject = _.toLower(req.body.subject);
        req.body.topic = _.toLower(req.body.topic);

        console.log(req.body);

        const post = await createPostValidate.validateAsync(req.body);

        console.log("post validated successfully");

        next();
    } catch (err) {
        if (err.isJoi == "true") next(createHttpErrors.BadRequest(err.message));
        return next(err);
    }
};

const validateGetPostsMiddleware = async (req, res, next) => {
    try {
        const { limit, subject, topic, offset, is_answered } = req.query;

        const validationResult = await getPostsValidate.validateAsync({
            limit,
            offset,
            subject,
            topic,
            is_answered,
        });

        req.validation = {
            value: validationResult,
        };
        next();
    } catch (err) {
        if (err.isJoi) {
            next(createHttpErrors.BadRequest(err.message));
            return next(err);
        }
    }
};

module.exports = { validatePostMiddleware, validateGetPostsMiddleware };
