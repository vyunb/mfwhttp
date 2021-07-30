import { App } from "@mfhttp/app";
import { Router } from "@mfhttp/router";
import { IncomingMessage as Request, ServerResponse as Response } from "http";

const app = new App();
const router = new Router<Request, Response>();

router.get("/user/:id", (req, res) => {
  res.end("ok");
});

app.get("/home", (req, res) => {
  res.end("home");
});

const logger = (req, res, next) => {
  console.log(req.pathname);
  next();
};

app.use(logger);
app.use("/api", router);

app.listen(3000, () => {
  console.log("server working on port: " + 3000);
});
