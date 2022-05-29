const path = require("path");
const fieldsDetails = require("../configs/other.details");

module.exports = (app) => {
    app.get(["/", "/home_page"], (req, res, next) => {
        const fields_link = `http://${req.headers.host}`;
        console.log(fields_link);
        const ejsData = {
            subHeading: "Fields",
            fields: Object.keys(fieldsDetails),
            fields_link,
        };
        console.log(ejsData);
        console.log(req.originalUrl, req.baseUrl);
        res.render("homePage", { ejsData });
        // res.sendFile(path.join(__dirname + "/../views/homePage.html"));
    });

    app.get("/:field/subjects", (req, res, next) => {
        let sideItems_link = [],
            main_link = [];
        const sideItems = Object.keys(fieldsDetails);
        const subjects = Object.keys(fieldsDetails[req.params.field].subjects);

        if (subjects) {
            for (let i = 0; i < sideItems.length; i++) {
                sideItems_link[
                    i
                ] = `http://${req.headers.host}/${sideItems[i]}/subjects`;
            }
            for (let i = 0; i < subjects.length; i++) {
                main_link[
                    i
                ] = `http://${req.headers.host}${req.originalUrl}/${subjects[i]}/topics`;
            }
            console.log(main_link, req.params.field, req.originalUrl);
            const ejsData = {
                sideHeading: "Fields",
                subHeading: "Subjects",
                main_link,
                sideItems_link,
                sideItems,
                mainItems: subjects,
            };
            console.log(ejsData);
            console.log(req.originalUrl, req.baseUrl);
            res.render("subjectsPage", { ejsData });
        } else {
            res.render("pageNotFound");
        }
    });

    app.get("/:field/subjects/:subName/topics", (req, res, next) => {
        let sideItems_link = [],
            main_link = [];
        const field = req.params.field;
        const sub = req.params.subName;
        const topics = fieldsDetails[field].subjects[sub].topicNames;
        const sideItems = Object.keys(fieldsDetails[field].subjects);

        console.log(field, sub, topics, sideItems, req.originalUrl);

        if (topics) {
            for (let i = 0; i < sideItems.length; i++) {
                sideItems_link[
                    i
                ] = `http://${req.headers.host}/${field}/subjects/${sideItems[i]}/topics`;
            }

            for (let i = 0; i < topics.length; i++) {
                main_link[
                    i
                ] = `http://${req.headers.host}${req.originalUrl}/${topics[i]}`;
            }
            const ejsData = {
                sideHeading: "Subjects",
                subHeading: "Topics",
                main_link,
                sideItems_link,
                mainItems: topics,
                sideItems,
            };
            // console.log(ejsData);
            // console.log(req.originalUrl, req.baseUrl);
            res.render("subjectsPage", { ejsData });
        } else {
            res.render("pageNotFound");
        }
    });

    app.get("/:field/subjects/:subName/topics/:topic", (req, res, next) => {
        let sideItems_link = [];
        const field = req.params.field;
        const sub = req.params.subName;
        const topics = fieldsDetails[field].subjects[sub].topicNames;
        const topic = req.params.topic;

        console.log(field, sub, topics);

        if (topics) {
            // for (let i = 0; i < sideItems.length; i++) {
            //     sideItems_link[
            //         i
            //     ] = `http://${req.headers.host}/${field}/subjects/${sideItems[i]}/topics/`;
            // }

            for (let i = 0; i < topics.length; i++) {
                sideItems_link[
                    i
                ] = `http://${req.headers.host}/${field}/subjects/${sub}/topics/${topics[i]}`;
            }
            const ejsData = {
                sideHeading: "Subjects",
                subHeading: topic.toUpperCase(),
                sideItems_link,
                sideItems: topics,
            };
            console.log(ejsData);
            console.log(req.originalUrl, req.baseUrl);
            res.render("feedPage", { ejsData });
        } else {
            res.render("pageNotFound");
        }
    });

    app.get("/posts/add", (req, res, next) => {
        const submitFormLink = `http://${req.headers.host}/api/v1/posts/add`;
        // const subjects = Object.keys(topicsDetails.subjects);
        // const heading = "Add Question";
        res.render("addQuesAnsPage", { submitFormLink });
    });

    app.use("/api/v1", require("../api/v1/apiv1.routes"));
};
