# Arquitetura Da Lambda De CPF

```mermaid
flowchart LR
  Cliente --> Gateway[API Gateway / Traefik]
  Gateway --> Lambda[Lambda CPF Auth]
  Lambda --> Validator[Validador de CPF]
  Lambda --> Postgres[(PostgreSQL gerenciado)]
  Lambda --> JWT[Geracao de JWT]
  JWT --> Cliente
```

## Responsabilidades

- Validar o CPF recebido.
- Consultar o cliente na base principal.
- Verificar se o cliente esta ativo.
- Emitir JWT especifico para o portal do cliente.
