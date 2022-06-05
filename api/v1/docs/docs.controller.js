
const topicsConfig = require("../../../configs/other.details");

const fields = Object.keys(topicsConfig);

const subjects = Object.entries(topicsConfig)
  .reduce((a, [field, { subjects }]) => {
    a[field] = Object.keys(subjects) || [];
    return a;
  }, {});

const allTopics = Object.entries(topicsConfig)
  .reduce((a, [field, {subjects}]) => {
    // console.log(subjects);
    return [
      ...a,
      ...Object.values(subjects)
        .map(subject => subject.topicNames || [])
        .flat(),
    ]
  }, []);

console.log(allTopics);

const allSubjects = Object.entries(subjects)
  .reduce((a, [field, subjects]) => {
    return [...a, ...subjects];
  }, []);

const limit = [
  1,
  2,
  5,
  10,
  20,
  30,
  50
];


exports.indexPage = (req, res, next) => {
  return res.render("docs/index", {
    filterData: {
      allSubjects,
      allTopics,
      limit,
    }
  });
};
