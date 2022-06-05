
const express = require("express");

const docsController = require("./docs.controller");

const docsRouter = express.Router();

docsRouter
  .get('/', docsController.indexPage);

module.exports = docsRouter;
