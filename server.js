const { readFile, readFileSync } = require("fs");
const express = require('express');
const app = express();

app.use("/public", express.static("./public"));
app.use("/dist", express.static("./dist"));

app.get("/", (request, response) => {
  response.redirect("/public");
});

app.listen(3000, () => {
  console.log("App running on http://localhost:3000.");
});