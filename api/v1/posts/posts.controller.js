const { Post, Unanswered } = require("./posts.model");

exports.getPosts = async (req, res, next) => {
  const { value } = req.validation;

  let query = Post.find({});

  if (value.subject !== undefined) {
    query = query.where("subject").equals(value.subject);
  }
  if (value.topic !== undefined) {
    query = query.where("topic").equals(value.topic);
  }
  if (value.limit !== undefined) {
    let limit = Math.max(Math.min(value.limit, 50), 1);

    query = query.limit(limit);
  }

  const queryResult = await query.exec();
  const result = queryResult.map(
    ({ question, answers, subject, topic, username, rating, ...rest }) => {
      return {
        id: rest._doc._id,
        question,
        answers,
        subject,
        topic,
        username,
        rating,
      };
    }
  );

  return res.json({
    message: "Fetched successfully",
    data: result,
  });
};

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
