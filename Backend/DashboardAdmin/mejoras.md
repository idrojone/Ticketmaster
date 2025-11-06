1.- Inyección de Prisma en modelos
    - Contrato: cada modelo recibe un cliente Prisma en su contructor.

2.- DTOs para Create/Update
    - Crear types o junto al schema.ts de cada ruta

    Ventajas:
        - evita pasar campos no deseados como id

3 .- Pulgin de errores y logger
    - Centralizar manejo de errores y logs
    - Evitar repetir try/catch en cada método
    - Usar pino ya incluiddo por Fastify

Mas avanzado:

4.- Test unitarios
    - Mock de Prisma Client con jest
    - Test de cada método CRUD

5.- ESLint / Prettier / TS strict / scripts

6.- Optimizaciones de Prisma