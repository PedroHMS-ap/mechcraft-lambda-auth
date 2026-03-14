# MechCraft Lambda CPF Auth

Repositorio dedicado a function serverless responsavel por autenticar clientes via CPF antes do acesso as rotas protegidas.

## Tecnologias

- Node.js 20
- AWS Lambda
- PostgreSQL
- JWT
- GitHub Actions

## Estrutura

- `src/handler.js`: entrada principal da function.
- `src/cpf-validator.js`: validacao e normalizacao de CPF.
- `docs/openapi.yaml`: contrato da API de autenticacao.
- `.github/workflows/ci-cd.yml`: pipeline de teste e deploy.

## Arquitetura

- [Diagrama da Lambda](docs/ARCHITECTURE.md)

## Variaveis de ambiente

- `DATABASE_URL`: string de conexao PostgreSQL.
- `CPF_JWT_SECRET` ou `JWT_SECRET`: segredo de assinatura JWT.
- `CPF_JWT_EXPIRES_IN`: expiracao do token, padrao `1h`.
- `PG_SSL`: use `disable` apenas em ambiente local sem SSL.

## Execucao local

```powershell
npm install
```

Dispare a function com um evento JSON semelhante a:

```json
{
  "body": "{\"cpf\":\"11144477735\"}"
}
```

## CI/CD

- PR em `homolog` ou `main`: executa testes.
- Push em `homolog`: publica em homolog.
- Push em `main`: publica em producao.

Secrets esperados:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_LAMBDA_CPF_AUTH_NAME`

## Swagger / Postman

- [Contrato OpenAPI do endpoint](docs/openapi.yaml)

## Observacao

As variaveis de ambiente da Lambda devem ser configuradas no proprio provedor cloud ou por um passo adicional de `update-function-configuration`.
