"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var express_1 = __importDefault(require("express"));
var app = express_1.default();
app.get("*", function (req, resp, err) {
    if (fs_1.default.existsSync("." + req.originalUrl)) {
        resp.sendFile(req.originalUrl, { root: "." });
    }
    else {
        resp.send("No.");
    }
});
app.listen(3000, function () {
    console.log("Server started");
});
