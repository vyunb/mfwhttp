import { parse } from "regexparam";

const METHODS = [
  "ACL",
  "BIND",
  "CHECKOUT",
  "CONNECT",
  "COPY",
  "DELETE",
  "GET",
  "HEAD",
  "LINK",
  "LOCK",
  "M-SEARCH",
  "MERGE",
  "MKACTIVITY",
  "MKCALENDAR",
  "MKCOL",
  "MOVE",
  "NOTIFY",
  "OPTIONS",
  "PATCH",
  "POST",
  "PRI",
  "PROPFIND",
  "PROPPATCH",
  "PURGE",
  "PUT",
  "REBIND",
  "REPORT",
  "SEARCH",
  "SOURCE",
  "SUBSCRIBE",
  "TRACE",
  "UNBIND",
  "UNLINK",
  "UNLOCK",
  "UNSUBSCRIBE",
] as const;

export type Method = typeof METHODS[number];

export type NextFunction = (error?: any) => void;

export type SyncHandler<Request, Response> = (
  req: Request,
  res: Response,
  next?: NextFunction
) => void;

export type AsyncHandler<Request, Response> = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void>;

export type Handler<Request, Response> =
  | AsyncHandler<Request, Response>
  | SyncHandler<Request, Response>;

export type RouterHandler<Request, Response> =
  | Handler<Request, Response>
  | Set<Handler<Request, Response>>;

export type RegexParams = {
  keys: string[] | false;
  pattern: RegExp;
};

type RIM<Request, Response, App> = (
  path: string,
  ...args: RouterHandler<Request, Response>[]
) => App;
type Route<Request, Response> = {
  path: string;
  method: Method;
  handlers: Set<RouterHandler<Request, Response>>;
  regex: RegexParams;
};

export class Router<Request, Response> {
  protected routes = new Set<Route<Request, Response>>();
  acl: RIM<Request, Response, this>;
  bind: RIM<Request, Response, this>;
  checkout: RIM<Request, Response, this>;
  connect: RIM<Request, Response, this>;
  copy: RIM<Request, Response, this>;
  delete: RIM<Request, Response, this>;
  get: RIM<Request, Response, this>;
  head: RIM<Request, Response, this>;
  link: RIM<Request, Response, this>;
  lock: RIM<Request, Response, this>;
  merge: RIM<Request, Response, this>;
  mkactivity: RIM<Request, Response, this>;
  mkcalendar: RIM<Request, Response, this>;
  mkcol: RIM<Request, Response, this>;
  move: RIM<Request, Response, this>;
  notify: RIM<Request, Response, this>;
  options: RIM<Request, Response, this>;
  patch: RIM<Request, Response, this>;
  post: RIM<Request, Response, this>;
  pri: RIM<Request, Response, this>;
  propfind: RIM<Request, Response, this>;
  proppatch: RIM<Request, Response, this>;
  purge: RIM<Request, Response, this>;
  put: RIM<Request, Response, this>;
  rebind: RIM<Request, Response, this>;
  report: RIM<Request, Response, this>;
  search: RIM<Request, Response, this>;
  source: RIM<Request, Response, this>;
  subscribe: RIM<Request, Response, this>;
  trace: RIM<Request, Response, this>;
  unbind: RIM<Request, Response, this>;
  unlink: RIM<Request, Response, this>;
  unlock: RIM<Request, Response, this>;
  unsubscribe: RIM<Request, Response, this>;

  constructor() {
    for (const m of METHODS) {
      this[m.toLowerCase()] = this.add(m as Method);
    }
  }

  private add(method: Method) {
    return (path: string, ...args: RouterHandler<Request, Response>[]) => {
      const handlers = new Set(args);
      const regex = parse(path);
      this.routes.add({ path, method, handlers, regex });
      return this;
    };
  }
}
