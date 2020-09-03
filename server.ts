import File from "fs";
import App from "express";
let app = App();

app.get("*", (req, resp, err) => {
  if (File.existsSync("." + req.originalUrl)) {
    resp.sendFile(req.originalUrl, { root: "." });
  } else {
    resp.send("No.");
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
