# 👤 Profile Component - Documentación

## 📋 Estructura Actual

El componente de perfil ha sido mejorado con una estructura moderna y preparada para futuras implementaciones.

## 🎨 Características Implementadas

### ✅ Header del Perfil
- **Banner superior** con gradiente personalizable
- **Avatar** con efecto hover y badge de edición
- **Información del usuario** (username, email, bio)
- **Estadísticas** (Favoritos, Reseñas, Tickets)
- **Botones de acción** (Editar Perfil / Seguir)

### ✅ Sistema de Tabs
- **Estructura preparada** para tabs funcionales
- **Navegación sticky** que permanece visible al hacer scroll
- **Tres tabs predefinidos**:
  - ⭐ Favoritos
  - 🎟️ Historial
  - 💬 Reseñas

### ✅ Diseño Responsive
- Adaptado para **desktop, tablet y móvil**
- En móvil, los tabs muestran solo iconos
- Layout optimizado para pantallas pequeñas

### ✅ Animaciones
- Transiciones suaves en elementos interactivos
- Animaciones de entrada (fadeIn, slideDown)
- Efectos hover en avatar, botones y stats

## 🚀 Próximos Pasos para Implementar Tabs Funcionales

### 1. Crear componentes para cada tab

```bash
# En la terminal
ng g c pages/profile/components/profile-favorites
ng g c pages/profile/components/profile-history
ng g c pages/profile/components/profile-reviews
```

### 2. Actualizar el HTML para usar los componentes

```html
<!-- Reemplazar el placeholder actual con esto: -->
<div class="tabs-content">
    @if (activeTab() === 'favorites') {
        <app-profile-favorites [userId]="datosProfile?.id" />
    }
    @if (activeTab() === 'history') {
        <app-profile-history [userId]="datosProfile?.id" />
    }
    @if (activeTab() === 'reviews') {
        <app-profile-reviews [userId]="datosProfile?.id" />
    }
</div>
```

### 3. Agregar funcionalidad a los botones de tabs

```html
<!-- Actualizar los botones en el HTML: -->
<button 
    class="tab-item" 
    [class.active]="activeTab() === 'favorites'"
    (click)="changeTab('favorites')">
    <i class="fas fa-star"></i>
    <span>Favoritos</span>
</button>
```

### 4. Implementar servicios para cada funcionalidad

```typescript
// favorites.service.ts
export class FavoritesService {
    getFavorites(userId: string): Observable<Concierto[]> {
        return this.apiService.get(`/user/${userId}/favorites`);
    }
    
    addFavorite(conciertoId: string): Observable<void> {
        return this.apiService.post('/favorites', { conciertoId });
    }
    
    removeFavorite(conciertoId: string): Observable<void> {
        return this.apiService.delete(`/favorites/${conciertoId}`);
    }
}
```

## 📁 Estructura de Archivos

```
pages/
└── profile/
    ├── profile.ts              ← Lógica del componente
    ├── profile.html            ← Template mejorado
    ├── profile.css             ← Estilos modernos
    ├── PROFILE_README.md       ← Esta documentación
    └── components/             ← (Crear estos)
        ├── profile-favorites/
        ├── profile-history/
        └── profile-reviews/
```

## 🎨 Paleta de Colores

```css
/* Gradientes principales */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--background-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

/* Colores de texto */
--text-primary: #1f2937;
--text-secondary: #6b7280;
--text-accent: #667eea;

/* Estados */
--error-color: #ef4444;
--success-color: #10b981;
```

## 🔧 Métodos Disponibles

### `changeTab(tab: TabType)`
Cambia el tab activo. Los valores posibles son:
- `'favorites'` - Muestra los conciertos favoritos
- `'history'` - Muestra el historial de compras
- `'reviews'` - Muestra las reseñas del usuario

### `loadUserProfile()`
Carga los datos del perfil desde el servidor.

### `checkIfEditable()`
Verifica si el perfil actual pertenece al usuario autenticado.

## 📱 Breakpoints Responsive

```css
/* Tablet y menores */
@media (max-width: 768px) {
    /* Layout de columna, avatar más pequeño */
}

/* Móvil */
@media (max-width: 480px) {
    /* Tabs solo con iconos, stats compactos */
}
```

## 🎯 Estado Actual

### ✅ Completado
- [x] Estructura HTML moderna
- [x] Estilos CSS profesionales
- [x] Sistema de tabs preparado
- [x] Diseño responsive
- [x] Animaciones y transiciones
- [x] Estados de error
- [x] TypeScript con signals

### ⏳ Pendiente (Para implementar)
- [ ] Componentes de tabs funcionales
- [ ] Servicios de favoritos/historial/reviews
- [ ] Endpoints del backend
- [ ] Modelos de datos
- [ ] Integración con API
- [ ] Tests unitarios

## 💡 Consejos para el Desarrollo

1. **Empieza por los favoritos**: Es la funcionalidad más sencilla
2. **Reutiliza componentes**: Usa `<app-card-conciertos>` en favoritos
3. **Maneja el loading**: Agrega spinners mientras cargan los datos
4. **Implementa paginación**: Para listas largas de datos
5. **Añade estados vacíos**: "No tienes favoritos aún"

## 🔗 Referencias

- [Angular Signals](https://angular.dev/guide/signals)
- [Angular Standalone Components](https://angular.dev/guide/components)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome Icons](https://fontawesome.com/)

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0.0  
**Autor:** Ticketmaster Team
