# PROJECT_CONTEXT: Custom Digital Signage Framework (DSF)

## 1. Visión y Objetivos
Desarrollar una plataforma de señalización digital autohospedada, inspirada en PosterBooking, para gestionar 5 Smart TVs de forma centralizada.
* **Cero Suscripciones:** Uso estricto de capas gratuitas (Firebase Spark Plan, Vercel/Netlify).
* **Escalabilidad:** Arquitectura desacoplada (Media > Playlists > Screens).
* **Estabilidad:** Diseñado para hardware de Smart TV (recursos limitados).

## 2. Arquitectura de Datos (Firestore)
El sistema debe manejar cuatro entidades principales:
1. **`media`**: 
   - `{ id, name, url, type (img/vid), size, createdAt }`
2. **`playlists`**: 
   - `{ id, name, items: [{ mediaId, duration, order }] }`
3. **`screens`**: 
   - `{ id, pairingCode, name, playlistId, lastSeen, status (online/offline) }`
4. **`settings`**: 
   - `{ adminEmail, globalRefreshTime: "04:00" }`

## 3. Lógica de Emparejamiento (Pairing System)
* **El Player:** Si no tiene un `deviceId` vinculado, genera un código aleatorio de 6 dígitos único y lo muestra en pantalla.
* **El Admin:** Introduce ese código en el Dashboard para "reclamar" la pantalla, asignarle un nombre y una Playlist.

## 4. Funcionalidades Críticas de Rendimiento
* **Manejo de Memoria:** Implementar `window.location.reload()` automático a las 04:00 AM para prevenir fugas de memoria en el navegador de la TV.
* **Pre-fetching:** El Player debe precargar el siguiente recurso (imagen/video) mientras el actual está en pantalla para evitar parpadeos negros.
* **Resiliencia Offline:** Guardar la última configuración de la playlist en `localStorage`. Si falla la conexión, el bucle debe continuar con el contenido local.
* **Muted Autoplay:** Todos los videos deben iniciarse con `muted` y `playsinline` para cumplir con las políticas de los navegadores modernos.

## 5. Restricciones Técnicas
* **Seguridad:** - Solo 1 Admin (vía Firebase Auth). Registro público deshabilitado.
   - Reglas de Firestore: Lectura pública para Players, Escritura solo para Admin.
* **Límites de Carga:** Máximo **50MB** por archivo (validación en frontend).
* **UI/UX:** - Dashboard: Tailwind CSS, responsive y funcional.
   - Player: Modo quiosco, sin barras de desplazamiento, transiciones suaves (fade-in/out).

## 6. Estructura de Archivos (Next.js 14 App Router)
* `/src/app/admin`: Rutas protegidas (Media, Playlists, Screens).
* `/src/app/player`: Vista de reproducción a pantalla completa.
* `/src/lib/firebase`: Configuración y utilidades de Firebase.
* `/src/hooks`: `useSignageLoop.js` para la lógica del temporizador y cambio de contenido.