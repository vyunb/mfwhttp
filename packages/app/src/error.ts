import { STATUS_CODES } from 'http'
export default (err, _req, res) => {
  const code = err.code in STATUS_CODES ? err.code : err.status

  if (typeof err === 'string' || Buffer.isBuffer(err)) res.writeHead(500).end(err)
  else if (code in STATUS_CODES) res.writeHead(code).end(STATUS_CODES[code])
  else res.writeHead(500).end(err.message)
}
