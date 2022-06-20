const mongoose = require("mongoose");
const { DB_URI_1, DB_URI_2 } = require("./secret");

const csanswerer = mongoose.createConnection(DB_URI_1);
// const sample = mongoose.createConnection(DB_URI_2);

// console.log(csanswerer);
// const connection = mongoose.connection;

// console.log(connection);

csanswerer.on("connected", () => {
    console.log(
        `SUCCESSFULLY established connection with database : ${csanswerer._connectionString}`
    );
});
// sample.on("disconnected", () => {
//     console.log("Connection terminated with database SUCCESSFULLY!");
// });
// sample.on("error", (err) => {
//     console.log(err);
// });
// sample.on("connected", () => {
//     console.log(
//         `SUCCESSFULLY established connection with database : ${sample._connectionString}`
//     );
// });

csanswerer.on("error", (err) => {
    console.log(err);
});

csanswerer.on("disconnected", () => {
    console.log("Connection terminated with database SUCCESSFULLY!");
});

process.on("SIGINT", async () => {
    await csanswerer.close();
    // await sample.close();
    process.exit(0);
});

module.exports = { csanswerer, /*sample*/ };
