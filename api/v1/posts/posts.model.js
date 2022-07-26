const { csanswerer } = require("../../../configs/db.config");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    answers: {
        type: [
            {
                answer: {
                    type: String,
                    default: "",
                },
                author_email: {
                    type: String,
                    default: "",
                },
            },
        ],
    },
    subject: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        default: "anonymous",
    },
    rating: {
        type: Number,
        required: true,
    },
    reviewed: {
        type: String,
        default: false,
    },
    author_email: {
        type: String,
        default: "",
    },
    is_answered: {
        type: Boolean,
        default: false,
    },
});

const Post = csanswerer.model("Post", postSchema);

module.exports = { Post };
