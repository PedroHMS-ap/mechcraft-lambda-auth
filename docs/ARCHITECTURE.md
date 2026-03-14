# Arquitetura Da Azure Function De CPF

```mermaid
flowchart LR
  Cliente --> Gateway[API Gateway / Traefik]
  Gateway --> Function[Azure Function CPF Auth]
  Function --> Validator[Validador de CPF]
  Function --> Postgres[(PostgreSQL gerenciado)]
  Function --> JWT[Geracao de JWT]
  JWT --> Cliente
```

## Responsabilidades

- Validar o CPF recebido.
- Consultar o cliente na base principal.
- Verificar se o cliente esta ativo.
- Emitir JWT especifico para o portal do cliente.
