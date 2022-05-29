const express = require("express");
const ejs = require("ejs");

const app = express();

require("./configs/db.config");
require("./configs/app.configs")(app);

// route to /api/v1
require("./routes/auth.routes")(app);

app.use((req, res, next) => {
    res.render("pageNotFound");
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message: err.message || "Something Went Wrong",
        },
    });
});

app.listen(2000, () => {
    console.log("server is up at 2000");
});
