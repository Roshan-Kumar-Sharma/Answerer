const Joi = require("joi");

const customFields = {
    question: Joi.string().required(),
    answers: Joi.array().max(3),
    subject: Joi.string().required(),
    topic: Joi.string().required(),
    username: Joi.string(),
    rating: Joi.number().required(),
    author_email: Joi.string()
        .email({ tlds: { allow: true } })
        .required(),
    is_answered: Joi.boolean().valid(true, false),
};

const createPostValidate = Joi.object({
    question: customFields.question,
    answers: customFields.answers,
    subject: customFields.subject,
    topic: customFields.topic,
    username: customFields.username,
    author_email: customFields.author_email,
    rating: customFields.rating,
    is_answered: customFields.is_answered,
});

const getPostsValidate = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    subject: customFields.subject,
    topic: customFields.topic,
    is_answered: customFields.is_answered,
});

module.exports = { createPostValidate, getPostsValidate };
