# Fase 5 — Escalabilidad

## Dependencias a instalar
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Archivos a modificar

### `src/app/admin/media/page.tsx`
- **Paginación:** cargar 20 items por lote, botón "Load More" al final
- **Búsqueda:** input de búsqueda por nombre (filtro local con useState + filter)
- **Filtro por tipo:** tabs o select para filtrar img/vid/todos
- **Batch delete:** checkboxes en cada card, botón "Delete Selected" cuando hay selección

### `src/app/admin/playlists/page.tsx`
- **Drag & drop:** reemplazar botones up/down con `@dnd-kit/sortable`
  - Wrapper `<DndContext>` + `<SortableContext>` alrededor de los items
  - Cada item como `<SortableItem>` con handle drag
- **Unsaved changes:** 
  - `beforeunload` event listener
  - Router guard con `useEffect` para detectar navegación sin guardar
- **Media picker search:** input de búsqueda en el panel izquierdo

## Verificación
- `npx tsc --noEmit` → sin errores
- Probar drag & drop manualmente
- Probar unsaved changes warning
