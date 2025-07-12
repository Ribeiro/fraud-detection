## 📦 1. [`gateway-api`]

Microserviço de entrada, que:

* Recebe transações
* Publica no tópico `transaction.requested`
* Aguarda `heuristic` + `ml`
* Calcula decisão e publica `transaction.result`

---

## 📦 2. [`antifraud-engine`]

Microserviço que:

* Consome `transaction.requested`
* Avalia regras heurísticas via Redis + YAML
* Produz `transaction.heuristicEvaluated`

---

## 📦 3. [`ml-risk-scorer`]

Microserviço que:

* Consome `transaction.requested`
* Simula ou calcula score de ML
* Produz `transaction.mlEvaluated`

---

## 🧰 4. [`infra`]

Infraestrutura completa:

* Kafka + Zookeeper
* Schema Registry da Confluent
* Redis + Postgres
* Dashboard de eventos Kafka (Node + logs)
* Scripts:

  * `setup.sh` ✅
  * `reset.sh` ✅
  * `docker-logs.sh` ✅
  * `kafka-topics.sh` ✅
* Postman collection `.json` com chamadas completas

---

## 🚀 Como começar:

1. Descompacte os 4 arquivos em pastas separadas.
2. Vá até `infra/` e execute:

   ```bash
   ./setup.sh
   ```
3. Suba os 3 microserviços com:

   ```bash
   docker compose up -d
   ```
4. Use o Postman para testar a requisição `POST /transactions/authorize`.

---