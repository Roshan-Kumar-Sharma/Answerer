// const { string } = require("joi");
const { csanswerer, sample } = require("../../../configs/db.config");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answers: {
    type: [{
      answer: {
        type: String,
        default: ""
      },
      author_email: {
        type: String,
        default: ""
      }
    }],
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
    default: ""
  },
  is_answered: {
    type: Boolean,
    default: false,
  },
});

let Post, Movies;

// try {
Post = csanswerer.model("Post", postSchema);
// Movies = sample.model("movies", new Schema({}), "movies");

// console.log(Movies.collection);

// Movies.find({})
//     .limit(2)
//     .exec((err, data) => console.log(data));
// } catch (error) {
//   console.log(error);
// }

module.exports = { Post, Movies };
