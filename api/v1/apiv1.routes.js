const express = require("express");
const router = express.Router();
// const topicsDetails = require("../../configs/other.details");

const subjectRoute = require("./subjects/subject.routes");
const postRoute = require("./posts/posts.routes");
// const userRoute = require("./users/users.routes");

router.use("/subjects", subjectRoute);
router.use("/posts", postRoute);

module.exports = router;
