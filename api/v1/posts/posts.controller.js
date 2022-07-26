const { Post } = require("./posts.model");
const { SMTP_AUTH_USER } = require("../../../configs/secret");
const emailService = require("../../../utils/email.service");
const urlUtils = require("../../../utils/url.utils");

const _ = require("lodash");

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
            data.is_answered = true;
        }

        const { author_email } = data;

        post = new Post(data);
        const result = await post
            .save()
            .catch((err) => console.log("error: ", err));

        const fullUrl = urlUtils.getFullUrl(req);

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

        console.log(updatedPost);

        const participant_emails = [ _.toLower(updatedPost.author_email) ];
        for(const answer of updatedPost.answers) {
            if(answer.answer
                && answer.author_email
                && !participant_emails.includes(_.toLower(answer.author_email))) {
                participant_emails.push(_.toLower(answer.author_email));
            }
        }

        console.log(participant_emails);

        const fullUrl = urlUtils.getFullUrl(req);

        for(const email of participant_emails) {
            const mailOptions = {
                from: `Q&A Place <${SMTP_AUTH_USER}>`,
                to: email,
                subject: `New answer was added to question #${_.truncate(updatedPost.question, { length: 30 })} [Q&A Website]`,
                html: `
<div>
  <p>Hello,<br/>&nbsp;&nbsp;&nbsp;&nbsp;A new answer was added to the question to which you contributed.
The link to the question: ${
      fullUrl + "/questions/" + updatedPost._id
  }</p>
</div>
            `,
            };

            // Send the mail asynchronously.
            emailService.sendMail(mailOptions);
        }

        res.send(updatedPost);
    } catch (err) {
        next(err);
    }
};
