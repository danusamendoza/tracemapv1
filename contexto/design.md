# Design System TraceMap

> **Estado actual (jun 2026):** UI con **Glassmorphism + Bento + mapa inmersivo** sobre fondo claro `#F5F5F5`, **negro como primario de marca** e iconografía **Phosphor**. Este documento describe lo que está **implementado y en uso** en el código.

## Principios

- **Claridad inmediata:** incidencias y retrasos escaneables en menos de 2 segundos.
- **Confianza:** datos actualizados, horarios y estados transparentes.
- **Uso en movimiento:** un toque, legibilidad alta, targets ≥ 44px.
- **Espacio respirable:** fondo claro y cards con aire para reducir ansiedad en alertas.
- **Minimalismo funcional:** negro sólido en marca; colores semánticos solo en alertas (warning/critical/success).

---

## Paleta y tokens (`src/index.css` → `@theme`)

| Token | Valor | Uso Tailwind |
|-------|-------|--------------|
| `--color-primary` | `#000000` | CTAs, pills activos, FAB, tab activo |
| `--color-primary-container` | `#171717` | Hover, gradientes (p. ej. card perfil) |
| `--color-on-primary-container` | `#FFFFFF` | Texto sobre negro |
| `--color-background` | `#F5F5F5` | Fondo app (`bg-background`) |
| `--color-surface-bg` | `#FFFFFF` | Superficies opacas legacy |
| `--color-success` | `#22C55E` | Resuelto, GPS activo |
| `--color-warning` | `#F59E0B` | Retrasos, clusters calientes, overlays mapa |
| `--color-critical` | `#EF4444` | Incidencias graves |
| `--color-text-secondary` | `#737373` | Metadatos |
| `--font-sans` | Inter | Tipografía global |

**Texto sobre fondo claro:** `#171717` (body). Secundario: `text-neutral-400` / `text-neutral-500`.

**Modo oscuro:** planificado, no implementado.

### Colores prohibidos en marca

No usar en UI de marca (sustituidos por negro/neutral):

- `#0066FF`, `#003d9b`, `#0052cc`, `#3B82F6`
- Clases `bg-blue-*`, `text-blue-*`, `text-indigo-*` en CTAs o navegación

---

## Glassmorphism

Utilidades en `src/index.css`. Preferir estas clases sobre fondos blancos planos en overlays, cards flotantes e inputs.

| Clase | Uso actual | Composición |
|-------|------------|-------------|
| `.glass-surface` | Headers sticky (detalle, reporte, tabs) | `rgba(255,255,255,0.66)` + `blur(20px) saturate(160%)`, borde blanco 60% |
| `.glass-card` | Cards, pills, búsqueda, nav flotante, carrusel mapa | `rgba(255,255,255,0.78)` + `blur(18px)`, borde blanco 65% |
| `.glass-surface-dark` | Toast de feedback | `rgba(10,10,10,0.58)` + `blur(16px)` |

Fallback `@supports not (backdrop-filter)` → fondo casi opaco.

El efecto glass se aprecia mejor sobre mapa o `bg-background`; sobre blanco puro es sutil.

**Componente:** `src/components/ui/GlassSurface.tsx` (wrapper de las tres variantes). En la práctica, la mayoría de pantallas aplican las clases CSS directamente; el componente está disponible para nuevos bloques.

---

## Bento (gran radio)

| Token / clase | Valor | Uso |
|---------------|-------|-----|
| `--radius-2xl` / `.bento-card` | 32px | Cards rutas, comunidad, perfil, carrusel mapa |
| `--radius-3xl` / `.bento-card-lg` | 40px | Card frontal del mazo (lista), card perfil |
| `--radius-xl` | 24px | Legacy puntual (`rounded-3xl` en `renderAlertCard`, pantalla heatmap no enlazada) |

Pills, búsqueda y FAB: `rounded-full`.

---

## Layout

```
Shell: min-h-screen max-w-md mx-auto border-x shadow-2xl overflow-hidden
Fondo: bg-background (#F5F5F5)
Nav inferior: FloatingNavBar — fixed bottom-4, centrado (`left-1/2 -translate-x-1/2`), `w-fit` (ancho según tabs), cápsula glass `rounded-full py-1.5 px-1.5`
Holgura scroll (tabs): pb-28 en main de Rutas / Comunidad / Perfil
Holgura lista Home: h-28 al final del scroll
```

### Home — vista Lista

- Top bar: avatar 48px, saludo, campana en círculo `glass-card`.
- Búsqueda: input `glass-card` h-11 rounded-full; refresh en círculo negro 44px.
- Filtros categoría: pill activo `bg-black text-white`; inactivo `glass-card`.
- Contenido: `StackedIncidentCards` (mazo glass + bento).
- **FAB:** píldora negra con texto «Reportar incidencia», contenedor `fixed inset-x-0 bottom-24 max-w-md mx-auto px-4 flex justify-end` (alineado al ancho de la app, no al viewport del navegador).

### Home — vista Mapa (inmersiva)

- Mapa full-bleed (`IncidentHeatMap` fullscreen).
- Overlay superior: `GlassPillBar` (avatar + pills categoría) + toggle Lista/Mapa en `glass-card`.
- Badge «GPS Activo»: `glass-card` rounded-full.
- Overlay inferior (`absolute bottom-0 pb-24`): **FAB circular** encima del carrusel horizontal de cards `glass-card bento-card`.
- Controles Leaflet desplazados (`top: 6.75rem`) para no solaparse con la pill bar.

### Tabs secundarias (Rutas, Comunidad, Perfil)

- Header sticky: `glass-surface border-b border-white/40`.
- Cards de contenido: `glass-card bento-card`.

### Flujos modales (detalle, reporte, éxito)

- **Reportar incidente** y **Detalle del incidente**: bottom sheets (`BottomSheet.tsx`) que se despliegan desde abajo sobre el Home (~90% alto, `max-h-[90%]`), con backdrop `bg-black/40`, grab handle, cierre arrastrando hacia abajo (desde handle/header) o tocando el fondo.
- **Reporte multi-paso**: un solo sheet con pasos `category` → `form` (`ReportSheet.tsx`); el Home permanece montado detrás.
- **Éxito** (`screen === 'success'`): pantalla completa (sin cambios).
- Contenido interno: migración parcial a glass. Conviven superficies legacy con CTAs negros sólidos.

### Pantalla `screen === 'heatmap'`

Código legacy **no enlazado** desde la navegación actual (sustituida por Home → Mapa inmersivo). No usar como referencia de diseño activo.

---

## Componentes UI (`src/components/`)

| Componente | Rol |
|------------|-----|
| `ui/GlassSurface.tsx` | Wrapper glass (variantes surface / card / dark) |
| `ui/GlassPillBar.tsx` | Barra píldora categorías sobre mapa (slots leading/trailing) |
| `ui/FloatingNavBar.tsx` | Nav flotante glass; activo = píldora negra icono + label; inactivos = solo icono |
| `StackedIncidentCards.tsx` | Mazo lista con swipe horizontal (`motion`, umbral 80px) |
| `IncidentHeatMap.tsx` | Mapa Leaflet + capas cluster / heat / radius |

---

## Vista Lista — Stacked Cards

Archivo: `src/components/StackedIncidentCards.tsx`.

- Card activa (`CardFace`): `glass-card bento-card-lg border border-white/60`, alto fijo `h-72`.
- Hasta 2 cards de fondo: `scale(0.95/0.90)`, `translateY(14/28px)`, opacidad reducida.
- Swipe horizontal (`motion`, umbral 80px o velocidad) → siguiente/anterior con salida rotada; tap → detalle. `touchAction: pan-y` para no bloquear scroll vertical.
- Card recién creada: anillo `ring-2 ring-emerald-500`.
- Un solo incidente: sin drag (mantiene la card al frente).
- No incluye contador ni hint de texto; la interacción es solo el mazo + swipe.

---

## Vista Mapa — capas (`IncidentHeatMap.tsx`)

**Tiles:** CARTO Positron (`light_all`).

| Capa | Implementación |
|------|----------------|
| **Clustering** | `leaflet.markercluster`, `maxClusterRadius: 50`, `spiderfyOnMaxZoom`. Burbuja `.cluster-bubble` negra; `.is-hot` naranja si count ≥ 4 |
| **Radius overlay** | `L.circle` naranja `#F59E0B`, sin borde, opacidad 0.10–0.22; zonas ~500 m vía `incidentsToDensityZones` |
| **Heatmap** | `leaflet.heat`: gradiente `#FFFFFF → #FED7AA → #FB923C → #EA580C` |
| **Marcadores hoja** | DivIcon semántico (critical/warning/primary) |

**Carrusel inferior:** cards `glass-card bento-card` w-64, snap horizontal; sync con mapa vía `activeCarouselId`.

**Brújula:** `bg-white/90 backdrop-blur-md` rounded-full; icono `Compass` con `animate-spin-slow` (8s). Oculta en mapa Home inmersivo (`showCompass={false}`).

---

## Iconografía

**Librería:** `@phosphor-icons/react` v2. **No usar Lucide.**

| Contexto | `weight` | Color |
|----------|----------|-------|
| Tab activo | `fill` | blanco sobre negro / `text-black` |
| Tab inactivo | `regular` | `text-neutral-500` |
| FAB, refresh | `bold` / `regular` | blanco sobre negro |
| Metadatos | `regular` | `text-neutral-400` |

| Uso | Phosphor |
|-----|----------|
| Búsqueda | `MagnifyingGlass` |
| Ubicación | `MapPin` |
| Notificaciones | `Bell` / `BellSlash` |
| Tabs | `House`, `Train`, `Users`, `User` |
| Lista / Mapa | `List`, `MapTrifold` |
| Refresh | `ArrowClockwise` |
| Filtros | `Funnel` |
| Comentarios / votos | `ChatCircle`, `ThumbsUp`, `ThumbsDown` |
| Compartir | `ShareNetwork` |
| Alertas | `Warning`, `WarningOctagon`, `WarningCircle` |
| Seguridad | `ShieldCheck` |
| Tiempo | `Clock` |
| Enviar | `PaperPlaneTilt` |
| Brújula | `Compass` |
| FAB | `Plus` |

---

## Tipografía (Inter)

| Rol | Tamaño / clase | Peso |
|-----|----------------|------|
| Título principal (h1) | `text-xl` / `text-lg` | 700 (`font-bold`) |
| Título card / incidente | `text-lg` – `text-sm` | 600 (`font-semibold`) |
| Heading pantalla (h2) | `text-sm` uppercase tracking-wide | 600 (`font-semibold`) |
| Heading sección (h3) | `text-base` – `text-xs` uppercase | 600 (`font-semibold`) |
| Overline sección (h4) | `text-xs` uppercase tracking-widest | 500 (`font-medium`) |
| Body / descripción | 11–14px | 400–500 |
| Caption / badges / CTAs | 9–10px | 600–800 |

---

## Espaciado

- Padding lateral pantalla: `px-4` (16px).
- Padding cards: `p-3.5` – `p-5`.
- Gap filtros: `gap-1.5`.
- Nav flotante ↔ borde inferior: 16px (`bottom-4`).
- FAB ↔ nav: `bottom-24` (96px).

---

## Sombras (en uso)

```
glass-card nav:     0 14px 44px rgba(0,0,0,0.16)
FAB:                0 12px 34px rgba(0,0,0,0.28–0.32)
glass-card cards:   0 10px 34px rgba(15,23,42,0.08)
Cluster bubble:     0 8px 22px rgba(0,0,0,0.28)
Leaflet zoom:       0 4px 12px rgba(15,23,42,0.12)
```

---

## Patrones de componente

### Pills / filtros

```
Activo:   bg-black text-white rounded-full
Inactivo: glass-card text-neutral-700 (mapa/lista) o glass-card en toggle Lista/Mapa
```

### FAB Reportar

| Vista | Forma | Posición |
|-------|-------|----------|
| Lista | Píldora con texto + icono Plus | `fixed`, contenedor `max-w-md mx-auto`, `bottom-24`, `right` dentro del contenedor |
| Mapa | Círculo 56px, solo Plus | `absolute` en stack inferior, encima del carrusel, `px-4 flex justify-end` |

Estilo común: `bg-black hover:bg-neutral-800 text-white`, `active:scale-95`.

### Bottom navigation (`FloatingNavBar`)

```
Cápsula compacta: glass-card rounded-full py-1.5 px-1.5 gap-1, w-fit centrada (no ancho fijo)
Tab activo: píldora negra h-11 — icono (fill) + label a la derecha, w-auto px-3.5
Tab inactivo: círculo blanco h-11 w-11, borde white/90, sombra suave, solo icono (regular)
Label activo: text-[11px] font-extrabold (capitalización del label en código)
```

### Toast

`glass-surface-dark`, `rounded-2xl`, icono ámbar, `AnimatePresence` + motion.

### Badges incidencia

```
Estado: bg-critical/90 | bg-warning/90 (semántico, no negro)
Origen: bg-white/70 glass-like en stack; bg-neutral-100 en carrusel legacy
```

---

## Animaciones

| Efecto | Implementación |
|--------|----------------|
| Micro-interacción | `active:scale-95` / `scale-[0.98–0.99]` |
| Transiciones UI | `duration-150` – `duration-200` |
| Spinner refresh | `animate-spin` en `ArrowClockwise` |
| Brújula | `animate-spin-slow` (8s) |
| Stack swipe | `motion` spring + exit con rotación |
| Toast | motion fade + slide |
| Confetti éxito | keyframes `fall`; colores negro, neutral, success, warning, critical |

---

## Utilidades CSS activas

Definidas en `src/index.css`:

- `.glass-surface`, `.glass-card`, `.glass-surface-dark`
- `.bento-card`, `.bento-card-lg`
- `.no-scrollbar`
- `.tracemap-cluster`, `.cluster-bubble`, `.cluster-bubble.is-hot`
- `.animate-spin-slow`
- Estilos Leaflet (`.leaflet-control-zoom`, `.leaflet-top`)

---

## Archivos fuente de verdad

| Archivo | Contenido |
|---------|-----------|
| `src/index.css` | Tokens `@theme`, glass, bento, clusters, Leaflet |
| `src/App.tsx` | Pantallas, helpers UI, layout Home lista/mapa |
| `src/components/IncidentHeatMap.tsx` | Mapa + cluster + heat + radius |
| `src/components/StackedIncidentCards.tsx` | Mazo lista |
| `src/components/ui/*.tsx` | Primitivos glass, nav, pill bar |
| `src/utils/heatmap.ts` | Puntos heat, zonas densidad, radios |

---

## JSON de referencia rápida

```json
{
  "color": {
    "primary": "#000000",
    "primaryContainer": "#171717",
    "background": "#F5F5F5",
    "surface": "#FFFFFF",
    "textPrimary": "#171717",
    "textSecondary": "#737373",
    "success": "#22C55E",
    "warning": "#F59E0B",
    "critical": "#EF4444"
  },
  "radius": {
    "bento": "32px",
    "bentoLg": "40px",
    "pill": "9999px"
  },
  "layout": {
    "maxWidth": "448px",
    "navBottom": "16px",
    "fabBottom": "96px",
    "scrollPaddingBottom": "112px"
  },
  "icons": {
    "library": "@phosphor-icons/react",
    "activeWeight": "fill",
    "defaultWeight": "regular"
  }
}
```
