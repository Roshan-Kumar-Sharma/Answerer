const Joi = require("joi");

const customFields = {
    question: Joi.string(),
    answers: Joi.array().max(3),
    subject: Joi.string(),
    topic: Joi.string(),
    username: Joi.string(),
    rating: Joi.number(),
    author_email: Joi.string()
        .email({ tlds: { allow: true } }),
    is_answered: Joi.boolean().valid(true, false),
};

const createPostValidate = Joi.object({
    question: customFields.question.required(),
    answers: customFields.answers,
    subject: customFields.subject.required(),
    topic: customFields.topic.required(),
    username: customFields.username,
    author_email: customFields.author_email.required(),
    rating: customFields.rating.required(),
    is_answered: customFields.is_answered,
});

const getPostsValidate = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    subject: customFields.subject.required(),
    topic: customFields.topic.required(),
    is_answered: customFields.is_answered,
});

module.exports = { createPostValidate, getPostsValidate };
