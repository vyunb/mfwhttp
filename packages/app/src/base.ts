import { createServer } from "http";
import { Router, Method, NextFunction } from "@mfhttp/router";
import { exec } from "./utils";
import error from "./error";

export class Base<Request, Response> extends Router<Request, Response> {
  protected attach: (req: Request, res: Response) => void;
  protected wares = new Set();
  protected error: (req: Request, res: Response, next: NextFunction) => void;
  protected nomatch: (req: Request, res: Response) => void;
  constructor() {
    super();
    this.error = error;
    this.nomatch = this.error.bind(null, { code: 404 });
    this.attach = (req, res) =>
      setImmediate(this.extend.bind(this, req, res), req, res);
  }

  private find(method: Method, path: string) {
    for (const route of this.routes) {
      const found = route.regex.pattern.test(path);

      if (found && method === route.method) {
        const params = exec(path, route.regex);
        return [true, route, params];
      }
    }
    return [false];
  }

  private extend(req: Request | any, res: Response | any) {
    const { searchParams, href, hash, pathname } = new URL(
      "http://" + req.headers.host + req.url
    );
    const [found, route, params] = this.find(req.method, pathname);
    if (!found) return this.nomatch(req, res);

    {
      req.params = params;
      req.query = searchParams;
      req.href = href;
      req.hash = hash;
      req.pathname = pathname;

      this.handler(req, res, route);
    }
  }

  private handler(req, res, route) {
    if (!res.finished) {
      const handlers = route.handlers.values();
      const next = (err) => (err ? console.log(err, req, res) : loop());
      const loop = () => {
        const { value } = handlers.next();
        value && value(req, res, next);
      };
      loop();
    }
  }

  listen(port: number, cb, host = "0.0.0.0") {
    const server = createServer();
    server.on("request", this.attach).listen(port, host, cb);
  }
}
