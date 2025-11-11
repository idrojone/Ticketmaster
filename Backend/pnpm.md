pnpm dev # Inicia el servidor de desarrollo
pnpm build # Crea una versión optimizada para producción
pnpm add <paquete>          # Añade una dependencia
pnpm add -D <paquete>       # Añade una devDependency
pnpm remove <paquete>      # Elimina una dependencia
pnpm add -g <paquete>       # Añade un paquete globalmente
pnpm prisma generate --schema=../prisma/schema.prisma # Genera el cliente Prisma
pnpm prisma db push --schema=../prisma/schema.prisma # Aplica el esquema de Prisma a la base de datos 