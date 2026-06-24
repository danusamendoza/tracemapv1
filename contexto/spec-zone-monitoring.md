# SPEC — Zone Monitoring

FEATURE: Mostrar en el top de Home (vista Lista) una card que resume qué tan segura es la zona actual del usuario y los indicadores clave de actividad de esa zona.

POR QUÉ (el valor): El usuario sabe de un vistazo si su zona es segura y cuánta actividad/incidencias hay a su alrededor antes de moverse.

ALCANCE — qué SÍ hago hoy:
- Nueva card "Zone Monitoring" en Home > vista Lista, ubicada encima del mazo StackedIncidentCards (debajo del top bar/filtros).
- Cabecera de la card: título "El transporte para ti", subtítulo "Reportes y alertas a tu alrededor", y a la derecha un bloque "Tu zona" con icono Broadcast + etiqueta de nivel (Segura / Moderada / Crítica) en color semántico.
- Fila horizontal scrolleable de tiles indicadores (glass/bento, icono Phosphor + valor + label):
  - Reportes: nº de incidencias activas en la zona (derivado de INITIAL_INCIDENTS).
  - Valoración: puntuación de la zona según usuarios (mock fijo, p. ej. 4.2/5), icono Star.
  - Resueltos: nº de incidencias resueltas (mock fijo), icono ShieldCheck.
  - Último incidente: tiempo desde el reporte más reciente (derivado del menor timeAgo), icono Clock.
- Nivel de seguridad: derivado por regla simple de mock (p. ej. crítico si hay ≥1 incidencia critical; moderado si hay warnings; seguro en caso contrario).
- Datos: MOCK, realistas. Sin backend ni base de datos real. Conteos derivados de INITIAL_INCIDENTS; valoración/resueltos como valores mock.

FUERA DE ALCANCE — qué NO debes tocar:
- La paleta, la tipografía y los componentes del design system.
- Nada de login, ajustes, ni features extra que no estén aquí.
- La vista Mapa, el flujo de reporte, detalle, Rutas, Comunidad ni Perfil.

RESTRICCIONES:
- Respeta ESTRICTAMENTE el design system (contexto/design.md). No inventes colores ni tipografías: usa tokens success/warning/critical para el nivel, glass-card + bento-card para superficies e iconos @phosphor-icons/react.
- Reutiliza los componentes y utilidades existentes (glass-card, bento-card, GlassSurface); no dupliques.
- No rompas los flujos que ya funcionan (mazo, swipe, navegación, FAB).

LISTO CUANDO (criterio de éxito verificable):
- Al abrir Home en vista Lista veo la card Zone Monitoring encima del mazo, con el nivel de zona y 4 tiles (Reportes, Valoración, Resueltos, Último incidente) con datos mock coherentes.
- El nivel y el conteo de reportes reflejan los incidentes mock actuales sin recargar la página.
- La vista Mapa y el resto de pantallas siguen funcionando igual que antes.
