const Joi = require("joi");

const customFields = {
  question: Joi.string().required(),
  answers: Joi.array().max(3),
  subject: Joi.string(),
  topic: Joi.string(),
  username: Joi.string(),
  rating: Joi.number(),
};

const createPostValidate = Joi.object({
  question: customFields.question,
  answers: customFields.answers,
  subject: customFields.subject,
  topic: customFields.topic,
  username: customFields.username,
  rating: customFields.rating,
});

const getPostsValidate = Joi.object({
  limit: Joi.number(),
  subject: customFields.subject,
  topic: customFields.topic,
});

module.exports = { createPostValidate, getPostsValidate };
