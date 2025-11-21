# Documentación del Backend - Ticketmaster

Este documento describe los tres servidores que componen el backend del proyecto Ticketmaster.

---

## 📋 Índice

1. [UserServices - Servicio de Usuarios](#1-userservices---servicio-de-usuarios)
2. [DashboardAdmin - Panel de Administración](#2-dashboardadmin---panel-de-administración)
3. [dashboard-empresa - Panel de Empresas](#3-dashboard-empresa---panel-de-empresas)

---

## 1. UserServices - Servicio de Usuarios

### 🔧 Tecnología
- **Framework**: Express.js
- **Base de datos**: MongoDB (Mongoose)
- **Puerto**: 3000
- **Lenguaje**: JavaScript

### 📍 Endpoints

#### **Autenticación (`/api`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Registrar nuevo usuario | No |
| POST | `/api/login` | Iniciar sesión | No |
| POST | `/api/refresh` | Renovar token de acceso | No |
| POST | `/api/logout` | Cerrar sesión | No |
| GET | `/api/user` | Obtener datos del usuario autenticado | JWT |
| PUT | `/api/user` | Actualizar datos del usuario | JWT |
| GET | `/api/user/:username` | Obtener detalles de usuario por username | No |

#### **Conciertos (`/api/conciertos`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/conciertos` | Obtener todos los conciertos | No |
| GET | `/api/conciertos/:slug` | Obtener un concierto por slug | No |
| GET | `/api/conciertos/genero/:slug` | Obtener conciertos por género | No |
| GET | `/api/ciudades` | Obtener todas las ciudades | No |
| POST | `/api/conciertos/like/:slug` | Dar like a un concierto | JWT |
| DELETE | `/api/conciertos/unlike/:slug` | Quitar like a un concierto | JWT |

#### **Géneros (`/api/generos`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/generos` | Obtener todos los géneros | No |
| GET | `/api/generos/:slug` | Obtener un género por slug | No |
| POST | `/api/generos` | Crear un nuevo género | No |

#### **Carousel (`/api/carousel`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/carousel/generos` | Obtener géneros para carousel | No |
| GET | `/api/carousel/conciertos` | Obtener conciertos para carousel | No |
| GET | `/api/carousel/conciertos/:slug` | Obtener un concierto para carousel | No |

#### **Comentarios**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/:slug/comentarios` | Añadir comentario a un concierto | JWT |
| GET | `/:slug/comentarios` | Obtener comentarios de un concierto | JWT Opcional |
| DELETE | `/:slug/comentarios/:id` | Borrar un comentario | JWT |

#### **Perfiles de Usuario**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/:username` | Obtener perfil de usuario | JWT Opcional |
| GET | `/:username/user/comentarios` | Obtener comentarios del usuario | JWT Opcional |
| GET | `/:username/user/likes` | Obtener likes del usuario | JWT Opcional |
| POST | `/:username/user/follow` | Seguir a un usuario | JWT |
| DELETE | `/:username/user/unfollow` | Dejar de seguir a un usuario | JWT |

### 📦 Modelos de Datos
- **Usuario**: Gestión de usuarios con autenticación
- **Concierto**: Información de conciertos
- **Género**: Categorías musicales
- **Comentario**: Comentarios en conciertos
- **Admin**: Usuarios administradores
- **Empresa**: Empresas organizadoras

---

## 2. DashboardAdmin - Panel de Administración

### 🔧 Tecnología
- **Framework**: Fastify
- **Base de datos**: PostgreSQL (Prisma ORM)
- **Puerto**: No especificado en código
- **Lenguaje**: TypeScript

### 📍 Endpoints

#### **Autenticación (`/auth`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Iniciar sesión de administrador | No |
| POST | `/auth/register` | Registrar nuevo admin (solo desarrollo) | No |
| GET | `/auth/user/:username` | Obtener usuario por username | JWT + Role |

#### **Conciertos (`/conciertos`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/conciertos` | Obtener todos los conciertos | JWT + Role |
| GET | `/conciertos/:slug` | Obtener un concierto por slug | JWT + Role |
| POST | `/conciertos` | Crear nuevo concierto | JWT + Role |
| PUT | `/conciertos/:slug` | Actualizar concierto | JWT + Role |
| PATCH | `/conciertos/:slug/activate` | Activar/desactivar concierto | JWT + Role |
| PATCH | `/conciertos/:slug/status` | Cambiar estado del concierto | JWT + Role |
| DELETE | `/conciertos/:slug` | Eliminar concierto | JWT + Role |

**Body para activar/desactivar:**
```json
{
  "is_active": true/false
}
```

**Body para cambiar estado:**
```json
{
  "status": "DRAFT" | "PUBLISHED" | "CANCELLED"
}
```

#### **Géneros (`/generos`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/generos` | Obtener todos los géneros | JWT + Role |
| GET | `/generos/:slug` | Obtener un género por slug | JWT + Role |
| POST | `/generos` | Crear nuevo género | JWT + Role |
| PUT | `/generos/:slug` | Actualizar género | JWT + Role |
| PATCH | `/generos/:slug/activate` | Activar/desactivar género | JWT + Role |
| PATCH | `/generos/:slug/status` | Cambiar estado del género | JWT + Role |
| GET | `/generos/id_genero` | Obtener géneros por id_genero | JWT + Role |

### 🔐 Autenticación
- Requiere JWT Token
- Requiere rol de administrador
- Middleware: `authenticate` y `authenticateRole`

### 📦 ORM
- **Prisma**: Schema ubicado en `../prisma/schema.prisma`

---

## 3. dashboard-empresa - Panel de Empresas

### 🔧 Tecnología
- **Framework**: NestJS (Microservicios)
- **Base de datos**: PostgreSQL (Prisma ORM)
- **Arquitectura**: Microservicios con TCP
- **Puerto API Gateway**: 3030
- **Lenguaje**: TypeScript

### 🏗️ Arquitectura
El sistema está dividido en varios microservicios:
1. **API Gateway** (Puerto 3030)
2. **Auth Service** - Servicio de autenticación
3. **Merch Service** - Gestión de merchandising
4. **Categoria Service** - Gestión de categorías

---

### 📍 API Gateway Endpoints (Puerto 3030)

#### **Sistema**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Hello World - Estado del Gateway |
| GET | `/health` | Health check |

#### **Autenticación (`/auth`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/auth/test` | Test del servicio de auth | No |
| POST | `/auth/register` | Registrar nueva empresa | No |
| POST | `/auth/login` | Login de empresa | No |

**Body Register:**
```json
{
  "email": "empresa@example.com",
  "password": "password123",
  "nombre": "Nombre Empresa"
}
```

**Body Login:**
```json
{
  "email": "empresa@example.com",
  "password": "password123"
}
```

#### **Merchandising (`/merchandising`)**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/merchandising` | Obtener todo el merchandising | Roles |
| GET | `/merchandising/:id` | Obtener merchandising por ID | Roles |
| POST | `/merchandising` | Crear nuevo merchandising | Roles |
| PATCH | `/merchandising/:id` | Actualizar merchandising | Roles |
| DELETE | `/merchandising/:id` | Eliminar merchandising | Roles |

**Ejemplo Body Create/Update:**
```json
{
  "nombre": "Camiseta Tour 2024",
  "descripcion": "Camiseta oficial del tour",
  "precio": 25.99,
  "stock": 100,
  "categoria_id": "uuid-categoria"
}
```

#### **Categorías (`/categories`)**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/categories` | Obtener todas las categorías | No |
| GET | `/categories/:id` | Obtener categoría por ID | No |
| POST | `/categories` | Crear nueva categoría | No |
| PATCH | `/categories/:id` | Actualizar categoría | No |
| DELETE | `/categories/:id` | Eliminar categoría | No |

**Ejemplo Body Create/Update:**
```json
{
  "nombre": "Ropa",
  "descripcion": "Categoría de ropa y textil"
}
```

---

### 🔐 Auth Service (Directo - Puerto separado)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar empresa | No |
| POST | `/auth/login` | Login empresa | No |
| GET | `/auth/profile` | Obtener perfil autenticado | JWT |
| GET | `/auth/empresa/:email` | Obtener empresa por email | JWT |

---

### 🛍️ Merch Service (Directo - Puerto separado)

Similar a los endpoints del gateway pero directos al microservicio.

| Método | Endpoint | Descripción | Roles Requeridos |
|--------|----------|-------------|------------------|
| GET | `/merchandising` | Listar merchandising | admin, empresa |
| GET | `/merchandising/:id` | Ver detalle | admin, empresa |
| POST | `/merchandising` | Crear | admin, empresa |
| PATCH | `/merchandising/:id` | Actualizar | admin, empresa |
| DELETE | `/merchandising/:id` | Eliminar | admin, empresa |

---

### 📦 Categoria Service (Directo - Puerto separado)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/categories` | Listar categorías |
| GET | `/categories/:id` | Ver detalle |
| POST | `/categories` | Crear categoría |
| PATCH | `/categories/:id` | Actualizar |
| DELETE | `/categories/:id` | Eliminar |

---

## 🔑 Variables de Entorno

### UserServices
- `PORT`: Puerto del servidor (default: 3000)
- `BIND_HOST`: Host de enlace (default: 127.0.0.1)
- `MONGODB_URI`: URI de conexión a MongoDB

### DashboardAdmin
- Base de datos configurada vía Prisma
- Variables JWT para autenticación

### dashboard-empresa
- Configuración de microservicios TCP
- Puertos de cada servicio
- Configuración Prisma compartida

---

## 🚀 Cómo Ejecutar

### UserServices
```bash
cd Backend/UserServices
npm install
npm run dev
```

### DashboardAdmin
```bash
cd Backend/DashboardAdmin
npm install
npm run dev
```

### dashboard-empresa

#### Opción 1: Todos los servicios
```bash
cd Backend/dashboard-empresa
npm install
npm run start:all:dev
```

#### Opción 2: Individual
```bash
# API Gateway
npm run start:gateway:dev

# Auth Service
npm run start:auth:dev

# Merch Service
npm run start:merch:dev

# Categoria Service
npm run start:categories:dev
```

---

## 📝 Notas Importantes

1. **UserServices** es el API público para usuarios finales
2. **DashboardAdmin** es para administradores de la plataforma
3. **dashboard-empresa** es para empresas que gestionan merchandising
4. Todos los servicios comparten el mismo esquema Prisma ubicado en `Backend/prisma/schema.prisma`
5. Se utiliza MongoDB para UserServices y PostgreSQL para los otros servicios

---

## 🗃️ Base de Datos

### MongoDB (UserServices)
- Usuarios
- Conciertos
- Géneros
- Comentarios
- Carousel
- Tokens de autenticación

### PostgreSQL (DashboardAdmin & dashboard-empresa)
- Géneros
- Conciertos
- Administradores
- Empresas
- Merchandising
- Categorías

---

*Documentación generada automáticamente - Ticketmaster Backend*
