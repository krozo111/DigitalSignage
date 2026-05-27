# Fase 1 — Foundation (Shared Components + Sonner Toasts)

## 1. Instalar sonner
```bash
npm install sonner
```

## 2. Crear estructura de directorios
```
src/components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Card.tsx
│   └── LoadingSkeleton.tsx
├── icons/           # (para Fase 4)
├── PageHeader.tsx
├── ConfirmDialog.tsx
└── Toaster.tsx
```

## 3. Archivos a crear

### `src/components/ui/Button.tsx`
- Props: variant (primary/secondary/danger/ghost), size (sm/md/lg), loading
- Variant styles: primary (accent), secondary (teal), danger (red), ghost (transparent)
- Loading state with spinner animation

### `src/components/ui/Input.tsx`
- Props: label, error, + all HTML input props
- Error border + error message below
- Focus ring yugo-accent

### `src/components/ui/Select.tsx`
- Props: label, error, options, placeholder, + HTML select props
- Custom chevron SVG arrow
- Same styling as Input

### `src/components/ui/Card.tsx`
- Wrapper con bg-yugo-primary/40, border-white/5, rounded-xl, backdrop-blur-sm
- Optional hover prop for hover effects

### `src/components/ui/LoadingSkeleton.tsx`
- Variants: card (grid skeleton), row (table rows), text (lines)
- Uses animate-pulse with bg-white/10

### `src/components/PageHeader.tsx`
- Props: title, description, actions (ReactNode)
- Flex layout, title + description on left, actions on right

### `src/components/ConfirmDialog.tsx`
- Replaces native confirm() with styled modal
- Escape key to close, click outside to close
- Variant: danger (red confirm button) / normal (accent)

### `src/components/Toaster.tsx`
- Wraps Sonner Toaster with dark theme + Yugo colors

## 4. Archivos a modificar

### `src/app/layout.tsx`
- Import Toaster from @/components/Toaster
- Add `<Toaster />` inside `<body>`, before or after `<AuthProvider>`

## 5. Verificación
- `npx tsc --noEmit` → sin errores
- `npx eslint src/app/page.tsx` → sin errores nuevos
- `npm run dev` → arranca sin problemas
