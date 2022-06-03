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
  if (value.offset !== undefined) {
    let offset = Math.max(value.offset, 0);

    query = query.skip(offset);
  }
  if (value.limit !== undefined) {
    let limit = Math.max(Math.min(value.limit, 50), 1);

    query = query.limit(limit);
  } else {
    query = query.limit(50);
  }

  try {
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
  } catch (e) {
    return res.json({
      error: true,
      message: "Unable to fetch posts",
    });
  }

exports.getSinglePost = async (req, res, next) => {
    try {
        let { id } = req.params;

        if (!id) throw new Error("id doesn't exist");

        let post = await Post.find({ _id: id });

        console.log(post);

        res.json(post);
    } catch (err) {
        next(err);
    }
};

module.exports.addPost = async (req, res, next) => {
    console.log("i'm post controller");
    try {
        let post;
        if (req.body.answers.length) post = new Post(req.body);
        else post = new Unanswered(req.body);
        await post.save();
        console.log(post);
        res.json(post);
    } catch (err) {
        next(err);
    }
};
