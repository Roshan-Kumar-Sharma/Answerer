const { Post } = require("./posts.model");
const emailService = require("../../../utils/email.service");
const { SMTP_AUTH_USER } = require("../../../configs/secret");

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
    if (value.is_answered !== undefined) {
        query = query.where("is_answered", value.is_answered);
    } else {
        query = query.where("is_answered", true);
    }

    try {
        const queryResult = await query.exec();

        const result = queryResult.map(
            ({
                question,
                answers,
                subject,
                topic,
                username,
                rating,
                ...rest
            }) => {
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
};

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
    console.log("Called after validating the post");

    try {
        const data = req.body;
        let post;

        console.log(data);

        if (data.answers.length) {
            data.answers = data.answers.map((answer) => ({
                answer: answer,
                author_email: data.author_email || "",
            }));
        }

        const { author_email } = data;

        post = new Post(data);
        const result = await post
            .save()
            .catch((err) => console.log("error: ", err));

        const protocol = req.protocol;
        const host = req.hostname;
        const port = 2000;
        const fullUrl = `${protocol}://${host}${
            [80, 443].includes(port) ? "" : `:${port}`
        }`;

        if (author_email) {
            const mailOptions = {
                from: `Q&A Place <${SMTP_AUTH_USER}>`,
                to: author_email,
                subject: "Your question was posted successfully [Q&A Website]",
                html: `
<div>
  <p>Hello,<br/>&nbsp;&nbsp;&nbsp;&nbsp;Your question was posted successfully. The link to the question: ${
      fullUrl + "/questions/" + result._id
  }</p>
</div>
            `,
            };

            // Send the mail asynchronously.
            emailService.sendMail(mailOptions);
        }

        console.log(post);
        res.json(post);
    } catch (err) {
        next(err);
    }
};

exports.updatePostAnswer = async (req, res, next) => {
    console.log("updating question");
    try {
        const { id, answer, email } = req.body;
        if (!id || !answer || !email) throw Error("Insufficient data");

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id },
            {
                $push: {
                    answers: {
                        author_email: email,
                        answer,
                    },
                },
                is_answered: true,
            },
            { new: true }
        );

        res.send(updatedPost);
    } catch (err) {
        next(err);
    }
};
