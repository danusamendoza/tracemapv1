# SPEC — Permisos y geolocalización

FEATURE: Mostrar una pantalla inicial al cargar la app donde el usuario configure geolocalización y notificaciones (en vivo y críticas) mediante toggles mock, y permitir editar esa misma configuración desde el tab Perfil.

POR QUÉ (el valor): El usuario entiende qué datos usa TraceMap y controla alertas antes de usar la app; puede ajustar preferencias después sin salir del flujo principal.

ALCANCE — qué SÍ hago hoy:
- Pantalla gate al iniciar la app (antes de Home): card glass/bento con título "Activa tu copiloto urbano", subtítulo breve y 3 toggles mock:
  - Geolocalización — "Ubicación en tiempo real" (icono MapPin).
  - Alertas en vivo — "Avisos mientras te mueves" (icono Bell).
  - Alertas críticas — "Suspensiones y cierres en tu ruta" (icono WarningOctagon).
- CTA "Empezar a moverme" que desbloquea el resto de la app.
- La pantalla se muestra en cada carga/recarga (sin persistencia en localStorage).
- Tab Perfil: sección "Permisos y notificaciones" con los mismos 3 toggles enlazados al mismo estado global; toast al cambiar.
- Componente reutilizable `Toggle` y tipo `PermissionsConfig` en `src/types.ts`.
- Datos: MOCK. No se invoca `navigator.geolocation` ni `Notification.requestPermission`.

FUERA DE ALCANCE — qué NO debes tocar:
- La paleta, la tipografía y los componentes del design system.
- Permisos reales del navegador, backend, push notifications reales ni persistencia entre sesiones.
- Login, otras pantallas de onboarding ni features extra no listadas aquí.

RESTRICCIONES:
- Respeta ESTRICTAMENTE el design system (`contexto/design.md`): glass-card, bento-card, negro primario, Phosphor.
- Reutiliza `Toggle` en gate y Perfil; no dupliques lógica de switch.
- Capitalización española tipo oración en copy (ver `content.md`).
- No rompas los flujos existentes (Home, reporte, nav flotante, Zone Monitoring).

LISTO CUANDO (criterio de éxito verificable):
- Al cargar la app veo el gate de permisos con 3 toggles y el botón "Empezar a moverme".
- Tras continuar entro a Home con el resto de flujos intactos.
- En Perfil > "Permisos y notificaciones" puedo editar los mismos toggles y veo un toast de confirmación.
- Al recargar la página el gate vuelve a aparecer.

---

## PLAN DE IMPLEMENTACIÓN

1. **Spec** — Este archivo (`contexto/spec-permisos-geolocalizacion.md`).
2. **Tipos** — `PermissionsConfig` en `src/types.ts`; estado `permissions` + `permissionsAcknowledged` en `App.tsx` (defaults: geo off, notificaciones on).
3. **Toggle** — `src/components/ui/Toggle.tsx` (switch accesible, pista negra ON / neutral OFF).
4. **Gate** — `src/components/PermissionsScreen.tsx` + filas compartidas en `PermissionSettingsFields.tsx`.
5. **Arranque** — En `App.tsx`, si `!permissionsAcknowledged`, renderizar solo el gate dentro del shell.
6. **Perfil** — Sección editable tras stats de contribución, mismo estado `permissions`.
7. **Verificación** — `npm run build` + flujo gate → Home → Perfil → recarga.
