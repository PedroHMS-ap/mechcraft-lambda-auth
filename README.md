# MechCraft Azure Function CPF Auth

Repositorio dedicado a Azure Function serverless responsavel por autenticar clientes via CPF antes do acesso as rotas protegidas.

## Tecnologias

- Node.js 20
- Azure Functions
- PostgreSQL
- JWT
- GitHub Actions

## Estrutura

- `src/handler.js`: logica principal de autenticacao.
- `src/functions/cpf-token/index.js`: adaptador HTTP para Azure Functions.
- `src/cpf-validator.js`: validacao e normalizacao de CPF.
- `docs/openapi.yaml`: contrato da API de autenticacao.
- `.github/workflows/ci-cd.yml`: pipeline de teste e deploy.

## Arquitetura

- [Diagrama da Function](docs/ARCHITECTURE.md)

## Variaveis de ambiente

- `DATABASE_URL`: string de conexao PostgreSQL.
- `CPF_JWT_SECRET` ou `JWT_SECRET`: segredo de assinatura JWT.
- `CPF_JWT_EXPIRES_IN`: expiracao do token, padrao `1h`.
- `PG_SSL`: use `disable` apenas em ambiente local sem SSL.

## Execucao local

```powershell
npm install
```

Para rodar localmente no Azure Functions Core Tools, crie `local.settings.json` com os mesmos valores de `.env.example` e execute:

```powershell
func start
```

Se quiser testar a logica sem o host da Azure Function, dispare o handler com um evento JSON semelhante a:

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

- `AZURE_CREDENTIALS`
- `AZURE_FUNCTIONAPP_NAME`

## Swagger / Postman

- [Contrato OpenAPI do endpoint](docs/openapi.yaml)

## Observacao

As variaveis de ambiente da Function App devem ser configuradas no proprio Azure Function App.
