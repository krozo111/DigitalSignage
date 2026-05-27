# Fase 2 — Player (TV) Transiciones & Overlay

## Archivo a modificar
- `src/app/page.tsx`

## Cambios

### 1. Fade-in/out entre media items (500ms)
- Mantener dos divs superpuestos: `currentItem` (fade-in) y `prevItem` (fade-out)
- Estado `prevItem` para trackear el item anterior
- Cuando `currentItem` cambia, poner `prevItem = currentItem`, esperar 500ms con `opacity-0`, luego limpiar prevItem
- Usar `transition-opacity duration-500`

### 2. Overlay inferior derecho
- Hora actual (formato HH:MM, update cada 1s con setInterval)
- Indicador de conexión: punto verde (`bg-yugo-secondary`) / rojo (`bg-red-500`)
- `pointer-events-none`, `opacity-40`, `text-xs`

### 3. Live-update badge
- Cuando `onSnapshot` del playlist dispara un cambio, mostrar badge "Content Updated" por 3s en esquina superior derecha
- Fade in/out con CSS transitions

### 4. Pairing code: pulse animation
- Agregar `animate-pulse` sutil al glow shadow del pairing code
- Usar keyframes custom en vez de Tailwind pulse (más suave)

## Verificación
- `npx tsc --noEmit` → sin errores
- Probar visualmente que el fade funcione cuando cambian los items
