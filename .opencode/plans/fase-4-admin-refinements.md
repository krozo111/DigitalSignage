# Fase 4 — Admin: Refinamientos Visuales

## Archivos a crear
- `src/components/icons/DashboardIcon.tsx`
- `src/components/icons/MediaIcon.tsx`
- `src/components/icons/PlaylistIcon.tsx`
- `src/components/icons/ScreenIcon.tsx`
- `src/components/icons/LogoutIcon.tsx`

## Archivos a modificar

### `src/app/admin/layout.tsx`
- Importar SVG icon components
- Reemplazar emojis (`📊 🖼️ 📋 🖥️`) con iconos SVG inline en navItems
- Ajustar espaciado del sidebar con íconos

### `src/app/admin/page.tsx` (Dashboard)
- Agregar íconos SVG a las tarjetas de métricas
- Mejorar quick start guide con íconos
- Agregar mini barra de estado de screens (online/offline count visual)

### `src/app/admin/media/page.tsx`
- Lazy loading optimizado (`loading="lazy"` ya existe, asegurar)
- Minor responsive fixes

## SVG Icon Specifications
- 20x20 viewBox
- strokeWidth 1.5 or 2
- currentColor para que hereden el color del texto
- Componentes funcionales que aceptan className

## Verificación
- `npx tsc --noEmit` → sin errores
