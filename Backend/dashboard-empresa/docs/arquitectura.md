proyecto-root/
├── apps/
│   ├── api-gateway/                 # 🚀 API Gateway (puerto 3030)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── gateway.module.ts
│   │   │   └── gateway.controller.ts
│   │   └── ...
│   │
│   ├── auth-service/                # 🔐 Auth Service (puerto 3031)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── profile.dto.ts
│   │   │   └── strategies/          # JWT/Passport
│   │   │       └── jwt.strategy.ts
│   │   └── ...
│   │
│   └── merchandise-service/         # 🛍️ Merchandise Service (puerto 3032)
│       ├── src/
│       │   ├── main.ts
│       │   ├── merchandise.module.ts
│       │   ├── merchandise/
│       │   │   ├── merchandise.controller.ts
│       │   │   ├── merchandise.service.ts
│       │   │   ├── dto/
│       │   │   │   ├── create-merchandise.dto.ts
│       │   │   │   ├── update-merchandise.dto.ts
│       │   │   │   └── merchandise.dto.ts
│       │   │   └── entities/
│       │   │       └── merchandise.entity.ts
│       │   ├── categories/
│       │   │   ├── category.controller.ts
│       │   │   ├── category.service.ts
│       │   │   └── entities/
│       │   │       └── category.entity.ts
│       │   └── guards/
│       │       └── auth.guard.ts    # Para validar JWT
│       └── ...
│
├── libs/
│   ├── common/
│   │   ├── src/
│   │   │   ├── dtos/
│   │   │   │   ├── auth.dto.ts
│   │   │   │   └── responses.dto.ts
│   │   │   ├── interfaces/
│   │   │   │   ├── user.interface.ts
│   │   │   │   └── jwt-payload.interface.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt.guard.ts    # Guard compartido
│   │   │   ├── decorators/
│   │   │   │   └── is-auth.decorator.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── messaging/
│       ├── src/
│       │   ├── event-patterns.ts    # Patrones de eventos RabbitMQ
│       │   └── index.ts
│       └── package.json
│
├── docker-compose.yml               # RabbitMQ, Postgres, etc
├── package.json                     # Monorepo
├── pnpm-workspace.yaml
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
└── arquitectura.md