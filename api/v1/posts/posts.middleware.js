const express = require("express");
const createHttpErrors = require("http-errors");
const { createPostValidate, getPostsValidate } = require("./posts.validation");

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
    if (!req.body.answers[0]) req.body.answers = [];
    if (!req.body.username) req.body.username = "anonymous";
    console.log(req.body);
    const post = await createPostValidate.validateAsync(req.body);
    console.log(req.body);
    next();
  } catch (err) {
    if (err.isJoi == "true") next(createHttpErrors.BadRequest(err.message));
    return next(err);
  }
};

const validateGetPostsMiddleware = async (req, res, next) => {
  try {
    const { limit, subject, topic } = req.query;

    const validationResult = await getPostsValidate.validateAsync({
      limit,
      subject,
      topic,
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
