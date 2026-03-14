const { handler } = require('../../handler');

function toEvent(req) {
  const body = req.body ?? (req.rawBody || {});
  return {
    body: typeof body === 'string' ? body : JSON.stringify(body),
    queryStringParameters: req.query ?? {},
  };
}

function parseBody(body) {
  if (typeof body !== 'string') return body;

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

module.exports = async function(context, req) {
  const result = await handler(toEvent(req));

  context.res = {
    status: result.statusCode ?? 200,
    headers: result.headers ?? {},
    body: parseBody(result.body),
  };
};
