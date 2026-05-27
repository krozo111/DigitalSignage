# Fase 3 — Admin: Tostadas + Skeletons + Validación

## Archivos a modificar

### `src/app/admin/media/page.tsx`
- Importar `toast` from `sonner`, `ConfirmDialog`, `LoadingSkeleton`
- Reemplazar `alert("File uploaded successfully")` → `toast.success(...)` 
- Reemplazar `alert(error.message)` → `toast.error(...)`
- Reemplazar `confirm("...")` → estado `confirmDelete` + `<ConfirmDialog>`
- Reemplazar `"Loading media..."` → `<LoadingSkeleton variant="card" count={8} />`
- Mejorar feedback de validación de tipo/tamaño

### `src/app/admin/playlists/page.tsx`
- Reemplazar todos los `alert()` con `toast.success/error`
- Reemplazar `confirm()` con ConfirmDialog
- Validación inline: nombre requerido (border red si vacío), duración >= 1
- LoadingSkeleton para list view
- Estado `confirmDelete` para el modal de confirmación

### `src/app/admin/screens/page.tsx`
- Reemplazar `alert()` con toasts
- Reemplazar `confirm()` con ConfirmDialog
- Validación inline del pairing code (exactamente 6 chars alfanuméricos)
- LoadingSkeleton para listado de screens
- Toast success en pair/update/delete

### `src/app/admin/page.tsx` (Dashboard)
- Reemplazar `"Loading metrics..."` con `<LoadingSkeleton variant="card" count={3} />`

## Verificación
- `npx tsc --noEmit` → sin errores
- `npx eslint src/app/admin/` → sin errores nuevos
