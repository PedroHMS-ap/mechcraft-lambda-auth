const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const { normalizeCpf, isValidCpf } = require('./cpf-validator');

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function getCpfFromEvent(event) {
  const body = typeof event?.body === 'string' ? JSON.parse(event.body || '{}') : event?.body || {};
  return normalizeCpf(body.cpf || event?.queryStringParameters?.cpf || '');
}

function getPgClient() {
  const sslDisabled = String(process.env.PG_SSL || '').toLowerCase() === 'disable';
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: sslDisabled ? false : { rejectUnauthorized: false },
  });
}

exports.handler = async event => {
  let client;
  try {
    const cpf = getCpfFromEvent(event);
    if (!isValidCpf(cpf)) {
      return jsonResponse(400, { message: 'CPF invalido' });
    }

    client = getPgClient();
    await client.connect();

    const result = await client.query(
      'SELECT id, document, active FROM "Customer" WHERE document = $1 LIMIT 1',
      [cpf],
    );

    if (!result.rows.length) {
      return jsonResponse(404, { message: 'Cliente nao encontrado' });
    }

    const customer = result.rows[0];
    if (!customer.active) {
      return jsonResponse(403, { message: 'Cliente inativo' });
    }

    const secret = process.env.CPF_JWT_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      return jsonResponse(500, { message: 'JWT secret nao configurado' });
    }

    const expiresIn = process.env.CPF_JWT_EXPIRES_IN || '1h';
    const accessToken = jwt.sign(
      {
        sub: String(customer.id),
        customerId: customer.id,
        cpf: customer.document,
        roles: ['customer'],
        tokenType: 'customer',
      },
      secret,
      { expiresIn },
    );

    return jsonResponse(200, {
      access_token: accessToken,
      token_type: 'Bearer',
      customer: {
        id: customer.id,
        cpf: customer.document,
        status: 'ACTIVE',
      },
    });
  } catch (error) {
    console.error('lambda-cpf-auth error', error);
    return jsonResponse(500, { message: 'Erro interno na autenticacao CPF' });
  } finally {
    if (client) {
      await client.end();
    }
  }
};

