import { Base } from './base'
import { RouterHandler, Router } from '@mfhttp/router'
import { parse } from 'regexparam'
import { IncomingMessage as Request, ServerResponse as Response } from 'http'

export class App extends Base<Request, Response> {
  private types = new Map<string, (path: string, ...args) => void>()
  constructor() {
    super()
    this.types = new Map([
      ['function', this.useWares.bind(this)],
      ['string', this.usePath.bind(this)]
    ])
  }
  private useWares = (...wares: RouterHandler<Request, Response>[]) => {
    const use = () => {
      for (const route of this.routes) {
        route.handlers = new Set([...wares, ...route.handlers]) as Set<RouterHandler<Request, Response>>
      }
    }
    process.nextTick(use)
  }
  private usePath = (path: string, ...fns) => {
    for (const { routes } of fns) {
      for (const route of routes) {
        route.path = path + route.path
        route.regex = parse(route.path)
        this.routes.add(route)
      }
    }
  }
  use(path, ...args: Router<Request, Response>[] | RouterHandler<Request, Response>[]) {
    const action = this.types.get(typeof path)
    action(path, ...args)
  }
}
