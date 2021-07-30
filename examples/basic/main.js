"use strict";
exports.__esModule = true;
var app_1 = require("@mfhttp/app");
var router_1 = require("@mfhttp/router");
var app = new app_1.App();
var router = new router_1.Router();
router.get("/user/:id", function (req, res) {
    res.end("ok");
});
app.get("/home", function (req, res) {
    res.end("home");
});
var logger = function (req, res, next) {
    console.log(req.pathname);
    next();
};
app.use(logger);
app.use("/api", router);
app.listen(3000, function () {
    console.log("server working on port: " + 3000);
});
