const fs = require("fs");
const sys = require("sys");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const util = require("util");
const PORT = process.env.PORT || 5000;

express()
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .post("/save_canvas", (req, res) => {
    const image = req.body.image;
    const data = image.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(data, "base64");
    fs.writeFile("public/image.png", buf, error => {
      res.setHeader("Content-Type", "text/plain");
      if (error) {
        res.write("POST request to save_canvas failed:");
        res.end(JSON.stringify(error, null, 2));
      }
      res.send("POST request to save_canvas worked.");
    });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
