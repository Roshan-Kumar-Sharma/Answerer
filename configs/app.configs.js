const express = require("express");
const morgan = require("morgan");
const path = require("path");

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("dev"));
    app.use(express.static(path.join(__dirname, "..", "public")));
    app.set("views", path.join(__dirname, "..", "views"));
    app.set("view engine", "ejs");
};
