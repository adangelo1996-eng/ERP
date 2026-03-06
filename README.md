## ERP enterprise cloud‑native

Questo repository contiene un sistema ERP modulare, cloud‑ready, composto da:

- **backend**: servizio API REST basato su NestJS/TypeScript, organizzato in moduli di dominio (Core, Finance, Produzione, Acquisti, Logistica, Magazzino, Legal, HR, Investimenti).

### Stack principale

- **Runtime**: Node.js LTS
- **Framework backend**: NestJS (monolite modulare evolvibile verso microservizi)
- **Linguaggio**: TypeScript
- **Database**: PostgreSQL (multi‑tenant a livello di schema)
- **Event bus**: astratto (possibile integrazione futura con Kafka o RabbitMQ)

### Struttura iniziale

- `backend/src/core`: `CorePlatform` (auth, tenant, master data, workflow, event bus, audit)
- `backend/src/finance`: dominio Finance (contabilità generale, AR/AP, tesoreria, controllo di gestione)
- `backend/src/production`: produzione & MRP
- `backend/src/procurement`: ufficio acquisti
- `backend/src/logistics`: logistica e trasporti
- `backend/src/warehouse`: magazzino (WMS)
- `backend/src/legal`: legal & compliance
- `backend/src/hr`: HR, timbratura, smartworking
- `backend/src/investment`: valutazione investimenti

Ogni modulo espone propri controller e servizi NestJS e comunica con gli altri domini tramite servizi condivisi e un event bus applicativo.

