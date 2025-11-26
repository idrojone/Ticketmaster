# Guía de Uso: `carritoMaster`

## Descripción

El método `carritoMaster` es una función inteligente que maneja automáticamente la creación y actualización del carrito de compras. Detecta si existe un carrito activo y actúa en consecuencia.

## Endpoint

```
POST /carrito/master
```

## Estructura del Body

```typescript
{
  conciertos: [
    { slug: 'string', cantidad: number }
  ],
  merchandising: [
    { merchandisingId: 'string', cantidad: number }
  ]
}
```

---

## Casos de Uso

### 1️⃣ Crear un Nuevo Carrito

Cuando NO existe un carrito activo, se crea uno nuevo con los productos indicados.

**Ejemplo Angular:**

```typescript
this.cartService
  .carritoMaster(
    [
      { slug: "concierto-rock-madrid-2024", cantidad: 2 },
      { slug: "festival-verano-2024", cantidad: 1 },
    ],
    [
      { merchandisingId: "673f1a2b3c4d5e6f7a8b9c0d", cantidad: 1 },
      { merchandisingId: "673f1a2b3c4d5e6f7a8b9c0e", cantidad: 3 },
    ]
  )
  .subscribe({
    next: (carrito) => {
      console.log("Carrito creado:", carrito);
      // Response: Status 201
    },
    error: (error) => console.error("Error:", error),
  });
```

**Body enviado:**

```json
{
  "conciertos": [
    { "slug": "concierto-rock-madrid-2024", "cantidad": 2 },
    { "slug": "festival-verano-2024", "cantidad": 1 }
  ],
  "merchandising": [
    { "merchandisingId": "673f1a2b3c4d5e6f7a8b9c0d", "cantidad": 1 },
    { "merchandisingId": "673f1a2b3c4d5e6f7a8b9c0e", "cantidad": 3 }
  ]
}
```

---

### 2️⃣ Agregar Productos (Incrementar Cantidad)

Usa **cantidades positivas** para agregar o incrementar productos en un carrito existente.

**Ejemplo: Agregar 1 entrada más a un concierto**

```typescript
this.cartService
  .carritoMaster(
    [
      { slug: "concierto-rock-madrid-2024", cantidad: 1 }, // +1
    ],
    []
  )
  .subscribe({
    next: (carrito) => {
      console.log("Cantidad incrementada:", carrito);
      // Response: Status 200
    },
  });
```

**Ejemplo: Agregar 2 productos de merchandising**

```typescript
this.cartService
  .carritoMaster(
    [],
    [
      { merchandisingId: "673f1a2b3c4d5e6f7a8b9c0d", cantidad: 2 }, // +2
    ]
  )
  .subscribe({
    next: (carrito) => console.log("Merchandising agregado:", carrito),
  });
```

---

### 3️⃣ Restar Productos (Decrementar Cantidad)

Usa **cantidades negativas** para restar o decrementar productos en un carrito existente.

**Ejemplo: Restar 1 entrada de un concierto**

```typescript
this.cartService
  .carritoMaster(
    [
      { slug: "concierto-rock-madrid-2024", cantidad: -1 }, // -1
    ],
    []
  )
  .subscribe({
    next: (carrito) => {
      console.log("Cantidad decrementada:", carrito);
      // Response: Status 200
    },
  });
```

**Ejemplo: Restar 2 unidades de merchandising**

```typescript
this.cartService
  .carritoMaster(
    [],
    [
      { merchandisingId: "673f1a2b3c4d5e6f7a8b9c0d", cantidad: -2 }, // -2
    ]
  )
  .subscribe({
    next: (carrito) => console.log("Cantidad reducida:", carrito),
  });
```

---

### 4️⃣ Eliminar Producto Completamente

Cuando la cantidad de un producto llega a **0 o menos**, se elimina automáticamente del carrito.

**Opción A: Restar la cantidad exacta**

```typescript
// Si el producto tiene cantidad 3, restarle -3
this.cartService
  .carritoMaster(
    [],
    [{ merchandisingId: "673f1a2b3c4d5e6f7a8b9c0d", cantidad: -3 }]
  )
  .subscribe({
    next: (carrito) => console.log("Producto eliminado:", carrito),
  });
```

**Opción B: Restar una cantidad mayor (más seguro)**

```typescript
// Restar -100 eliminará el producto sin importar cuántos tenga
this.cartService
  .carritoMaster([{ slug: "concierto-rock-madrid-2024", cantidad: -100 }], [])
  .subscribe({
    next: (carrito) => console.log("Producto eliminado:", carrito),
  });
```

---

### 5️⃣ Operaciones Mixtas

Puedes agregar y restar diferentes productos en una sola llamada.

**Ejemplo: Agregar concierto, restar merchandising**

```typescript
this.cartService
  .carritoMaster(
    [
      { slug: "concierto-pop-barcelona", cantidad: 2 }, // Agregar 2
      { slug: "concierto-rock-madrid-2024", cantidad: -1 }, // Restar 1
    ],
    [
      { merchandisingId: "673f1a2b3c4d5e6f7a8b9c0d", cantidad: 1 }, // Agregar 1
      { merchandisingId: "673f1a2b3c4d5e6f7a8b9c0e", cantidad: -2 }, // Restar 2
    ]
  )
  .subscribe({
    next: (carrito) => console.log("Carrito actualizado:", carrito),
  });
```

---

### 6️⃣ Solo Conciertos (Merchandising vacío)

```typescript
this.cartService
  .carritoMaster(
    [{ slug: "festival-musica-electronica", cantidad: 3 }],
    [] // Array vacío de merchandising
  )
  .subscribe({
    next: (carrito) => console.log("Solo conciertos:", carrito),
  });
```

---

### 7️⃣ Solo Merchandising (Conciertos vacío)

```typescript
this.cartService
  .carritoMaster(
    [], // Array vacío de conciertos
    [
      { merchandisingId: "673f1a2b3c4d5e6f7a8b9c0d", cantidad: 2 },
      { merchandisingId: "673f1a2b3c4d5e6f7a8b9c0f", cantidad: 1 },
    ]
  )
  .subscribe({
    next: (carrito) => console.log("Solo merchandising:", carrito),
  });
```

---

### 8️⃣ Agregar Nuevo Producto a Carrito Existente

Si el producto NO existe en el carrito, se agrega como nuevo item.

```typescript
// Carrito actual: [{ slug: 'concierto-A', cantidad: 2 }]
this.cartService
  .carritoMaster(
    [
      { slug: "concierto-B", cantidad: 1 }, // Nuevo producto
    ],
    []
  )
  .subscribe({
    next: (carrito) => {
      // Resultado: [
      //   { slug: 'concierto-A', cantidad: 2 },
      //   { slug: 'concierto-B', cantidad: 1 }  ← Nuevo
      // ]
    },
  });
```

---

## Comportamiento Automático

| Situación                     | Acción del Backend                  | Status Code |
| ----------------------------- | ----------------------------------- | ----------- |
| No existe carrito activo      | Crea un nuevo carrito               | `201`       |
| Existe carrito activo         | Actualiza el carrito existente      | `200`       |
| Cantidad positiva             | Agrega o incrementa producto        | `200/201`   |
| Cantidad negativa             | Resta o decrementa producto         | `200`       |
| Cantidad llega a ≤ 0          | Elimina producto del carrito        | `200`       |
| Producto no existe en carrito | Agrega como nuevo (si cantidad > 0) | `200/201`   |

---

## Respuestas del Backend

### ✅ Éxito (201 - Carrito Creado)

```json
{
  "_id": "673f1a2b3c4d5e6f7a8b9c0d",
  "userId": "673f1a2b3c4d5e6f7a8b9abc",
  "conciertos": [
    {
      "conciertoId": "673f1a2b3c4d5e6f7a8b9def",
      "cantidad": 2
    }
  ],
  "merchandising": [
    {
      "merchandisingId": "673f1a2b3c4d5e6f7a8b9ghi",
      "cantidad": 1
    }
  ],
  "precio": 150.5,
  "status": "PENDING",
  "is_active": true,
  "createdAt": "2024-11-26T20:00:00.000Z",
  "updatedAt": "2024-11-26T20:00:00.000Z"
}
```

### ✅ Éxito (200 - Carrito Actualizado)

```json
{
  "_id": "673f1a2b3c4d5e6f7a8b9c0d",
  "userId": "673f1a2b3c4d5e6f7a8b9abc",
  "conciertos": [
    {
      "conciertoId": "673f1a2b3c4d5e6f7a8b9def",
      "cantidad": 3 // Cantidad actualizada
    }
  ],
  "merchandising": [],
  "precio": 225.75,
  "status": "PENDING",
  "is_active": true,
  "createdAt": "2024-11-26T20:00:00.000Z",
  "updatedAt": "2024-11-26T20:05:00.000Z"
}
```

### ❌ Error (404 - Usuario no encontrado)

```json
{
  "error": "Usuario no encontrado"
}
```

### ❌ Error (404 - Producto no encontrado)

```json
{
  "error": "Concierto no encontrado: concierto-invalido"
}
```

```json
{
  "error": "Merchandising no encontrado: 673f1a2b3c4d5e6f7a8b9xyz"
}
```

### ❌ Error (500 - Error del servidor)

```json
{
  "error": "Error message here"
}
```

---

## Ejemplos de Uso en Componentes

### Botón para Agregar al Carrito (Página de Producto)

```typescript
agregarAlCarrito(slug: string, cantidad: number = 1) {
  this.cartService.carritoMaster(
    [{ slug, cantidad }],
    []
  ).subscribe({
    next: (carrito) => {
      this.showNotification('Producto agregado al carrito');
      this.updateCartCount(carrito);
    },
    error: (error) => this.showError('Error al agregar producto')
  });
}
```

### Botón de Incrementar Cantidad (Card del Carrito)

```typescript
incrementarCantidad(producto: CartItem) {
  const conciertos = producto.type === 'concierto'
    ? [{ slug: producto.slug, cantidad: 1 }]
    : [];

  const merchandising = producto.type === 'merchandising'
    ? [{ merchandisingId: producto.merchandisingId, cantidad: 1 }]
    : [];

  this.cartService.carritoMaster(conciertos, merchandising).subscribe({
    next: () => this.recargarCarrito(),
    error: (error) => console.error('Error:', error)
  });
}
```

### Botón de Decrementar Cantidad (Card del Carrito)

```typescript
decrementarCantidad(producto: CartItem) {
  const conciertos = producto.type === 'concierto'
    ? [{ slug: producto.slug, cantidad: -1 }]
    : [];

  const merchandising = producto.type === 'merchandising'
    ? [{ merchandisingId: producto.merchandisingId, cantidad: -1 }]
    : [];

  this.cartService.carritoMaster(conciertos, merchandising).subscribe({
    next: () => this.recargarCarrito(),
    error: (error) => console.error('Error:', error)
  });
}
```

### Botón de Eliminar Producto (Card del Carrito)

```typescript
eliminarProducto(producto: CartItem) {
  const conciertos = producto.type === 'concierto'
    ? [{ slug: producto.slug, cantidad: -100 }]  // Cantidad negativa grande
    : [];

  const merchandising = producto.type === 'merchandising'
    ? [{ merchandisingId: producto.merchandisingId, cantidad: -100 }]
    : [];

  this.cartService.carritoMaster(conciertos, merchandising).subscribe({
    next: () => {
      this.showNotification('Producto eliminado');
      this.recargarCarrito();
    },
    error: (error) => console.error('Error:', error)
  });
}
```

---

## Notas Importantes

⚠️ **Autenticación Requerida**: El endpoint usa `verifyJWT`, por lo que debes estar autenticado.

⚠️ **Slug vs ID**:

- Conciertos se identifican por `slug` (string único)
- Merchandising se identifica por `merchandisingId` (ObjectId de MongoDB)

⚠️ **Precio Automático**: El backend calcula automáticamente el precio total del carrito.

⚠️ **Estado del Carrito**: Los carritos nuevos se crean con `status: "PENDING"` y `is_active: true`.

✅ **Validaciones**: El backend valida que los productos existan antes de agregarlos.

✅ **Recalcular Precio**: El precio se recalcula automáticamente en cada actualización.
