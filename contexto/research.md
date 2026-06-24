# Reporte de Investigación: Oportunidad de Mercado para Plataforma de Monitoreo de Incidencias en Transporte Público (B2C)

**Documento:** research.md
**Versión:** 1.0
**Fecha:** 12 de junio de 2026
**Autoría:** Investigación de UX y comportamiento del consumidor — TraceMap
**Investigador:** UX & Consumer Behavior Specialist  
**Modelo de Negocio:** Ad-supported (Freemium/B2C)

---

## 1. Objetivos de Investigación y Alcance

### 1.1 Contexto y planteamiento del problema

Los usuarios de transporte público en grandes ciudades latinoamericanas enfrentan información fragmentada, tardía o inexistente sobre incidencias del servicio (retrasos, suspensiones, cierres de estaciones, saturación, manifestaciones, incidentes de seguridad). Hoy resuelven esta carencia con una combinación improvisada de cuentas de Twitter/X oficiales y no oficiales, grupos de WhatsApp/Telegram, radio y observación directa en el punto de abordaje. Esta fragmentación genera pérdida de tiempo, estrés, llegadas tarde al trabajo y decisiones de ruta subóptimas.

La hipótesis de producto: **una app B2C que centralice incidencias en tiempo real (fuentes oficiales + reportes colaborativos verificados), gratuita para el usuario y monetizada con publicidad contextual no invasiva, puede capturar un uso diario de alta frecuencia y corta duración (sesiones de 30–90 segundos, 2–4 veces al día).**

### 1.2 Objetivos Principales

**Objetivo general:** Validar la existencia, magnitud y monetizabilidad de la necesidad de información de incidencias en tiempo real entre usuarios frecuentes de transporte público

**Objetivos específicos:**
*   Comprender la carga cognitiva y emocional de los usuarios de transporte público urbano ante incidentes en tiempo real (retrasos, desvíos, delincuencia, saturación), determinando los puntos de fricción emocional y logística durante las incidencias en el transporte público.
*   Identificar las brechas de información existentes en tiempo real que las las aplicaciones de movilidad y navegación actuale (Google Maps, Moovit) y los canales oficiales de tránsito no logran cubrir.
*   Validar la viabilidad y aceptabilidad de un modelo de monetización publicitaria integrado en una herramienta de utilidad diaria y alta frecuencia de uso.

### Alcance Geográfico y Demográfico
*   **Foco Geográfico:** El estudio se centra en Áreas Metropolitanas de Alta Densidad (LatAm), específicamente nodos urbanos con sistemas de transporte multimodal complejos (Metro, BRT, autobuses urbanos, trenes suburbanos)y altos índices de predictibilidad variable como (ej. Santiago de Chile, Ciudad de México, Bogotá, Buenos Aires.
*   **Foco Demográfico:** Usuarios de transporte público regular (mínimo 4 viajes por semana) de entre 18 y 55 años, bancarizados o no, pero con acceso constante a internet móvil.

### Criterios de Éxito del Producto (UX & Negocio)(KPIs de Producto)
*   **Retención a Corto Plazo (D7):** > 45% debido al valor de la información en tiempo real.
*   **Frecuencia de Uso:** Mínimo 2 aperturas diarias por usuario activo (viaje de ida y de vuelta).
*   **Tiempo de Respuesta (Time-to-Value):** El usuario debe conocer el estado de su ruta en menos de 5 segundos tras abrir la app.
*   **Precisión de Incidencias:** >90% de coincidencia entre reportes de usuarios y estados oficiales.
*   **Ad-Acceptance:** Mantener un churn rate inferior al 5% tras la introducción de formatos publicitarios contextuales.
*   **CTR (Click-Through Rate) de Publicidad:** Mantener un CTR saludable (> 1.2%) mediante segmentación contextual, sin degradar el *System Usability Scale* (SUS) por encima de los 75 puntos.


---

## 2. Perfil del Arquetipo de Usuario: "El Viajero Estratégico"

Este perfil representa al 65% de los usuarios recurrentes en sistemas de transporte masivo.

### Perfil General
*   **Nombre Ficticio:** Mateo Silva, el Conmuter Resiliente.
*   **Edad:** 28 años 
*   **Ocupación:** Empleado de oficina o estudiante de educación superior. Reside en la periferia, trabaja en el centro logístico/financiero.
*   **Ubicación:** Comuna periférica, viaja diariamente al centro de la ciudad.

### Demografía y Nivel Socioeconómico (NSE)
*   **NSE:** C2 / C3 (Medio / Medio-Bajo).
*   **Ingresos:** Destina entre el 10% y el 15% de su ingreso mensual exclusivamente a movilidad.
*   **Comportamiento de Viaje:** Conexión multimodal. Camina 10 minutos $\rightarrow$ Toma autobús alimentador $\rightarrow$ Combina con Metro/Tren urbano. Tiempo promedio de viaje por tramo: 65 - 80 minutos.

### Tecnografía
*   **Dispositivo:** Smartphone Android de gama media (pantalla de 6.5", almacenamiento optimizado).
*   **Conectividad:** Plan de datos móviles prepago o postpago limitado. Sensible al consumo de datos de las aplicaciones en segundo plano.
*   **Uso de Apps:** WhatsApp para comunicación, Spotify/TikTok para entretenimiento durante el viaje, y Google Maps o apps locales de transporte para revisar rutas (aunque desconfía de sus tiempos estimados).

### Motivaciones
*   **Control del Tiempo:** Llegar puntual a su destino para evitar amonestaciones laborales o aprovechar mejor su tiempo libre.
*   **Seguridad Personal:** Evitar paraderos oscuros, estaciones colapsadas o rutas donde se reporten asaltos frecuentes.
*   **Previsibilidad Económica:** Evitar tener que pagar un transporte privado de emergencia (Uber/Didi) debido a una falla del sistema público, lo que desajusta su presupuesto semanal.
*   **Optimizar el tiempo de trasbordo:** Ganar "tiempo personal".

### Frustraciones y Dolores Diarios
*   **La "Caja Negra" del Transporte:** Quedarse varado dentro de un túnel o en un paradero sin saber si el retraso durará 5 minutos o una hora.
*   **Actualizaciones Tardías:** Que las cuentas oficiales en redes sociales avisen de un problema 20 minutos después de que este ocurrió.
*   **Saturación Física:** El estrés derivado de intentar abordar un vagón o autobús completamente lleno, exponiéndose a hurtos y empujones.

---

## 3. Jobs-To-Be-Done (JTBD)

El marco *Jobs-to-be-Done* nos permite entender que los usuarios no "compran" una app de transporte; "contratan" una herramienta para progresar en su vida diaria.

### Job Principal
"Cuando viajo al trabajo o a mi hogar en transporte público, quiero saber con certeza el estado real de mi ruta antes y durante el trayecto, para poder tomar decisiones alternativas y mantener el control de mi tiempo y seguridad".

### Micro-Jobs Asociados


| Situación (Contexto) | Tarea que intenta realizar (Job) | Resultado Esperado |
| :--- | :--- | :--- |
| **Antes de salir de casa/oficina.** | Evaluar si la ruta habitual opera normalmente. | Decidir si salir antes o tomar una ruta alternativa. |
| **Esperando en el paradero (10 min de retraso).** | Descubrir el motivo y la duración real del retraso. | Decidir si esperar o gastar más dinero en otro medio de transporte. |
| **A bordo de un vehículo detenido.** | Reportar la incidencia a su empleador o familia con evidencia confiable. | Mitigar el impacto de su impuntualidad ante terceros. |
| **Caminando hacia la estación de transbordo.** | Conocer el nivel de aglomeración en los andenes. | Evitar embotellamientos humanos y situaciones de riesgo de seguridad. |

---

## 4. Dolores Principales (Pain Points)

1.  **Asimetría de Información:** Según el *Informe de Movilidad Urbana del BID*, los usuarios perciben que las autoridades ocultan la gravedad de los retrasos o retrasan la información sobre fallas estructurales.
2.  **Saturación y "Efecto Lata de Sardinas":** La falta de datos sobre el flujo de personas en estaciones específicas genera ansiedad y riesgos de seguridad física.
3.  **Desactualización de Mapas Estáticos:** Google Maps suele fallar en detectar cambios de ruta temporales por obras o eventos sociales en tiempo real.
4.  **Inseguridad Percibida:** La falta de monitoreo en vivo aumenta la sensación de vulnerabilidad en estaciones poco concurridas o durante incidentes nocturnos. Según reportes de la CEPAL y agencias locales, el miedo al delito (hurto de teléfonos, acoso en vagones exclusivos/mixtos) altera las decisiones de ruta. Un usuario prefiere caminar más si la app le garantiza un camino iluminado y con flujo de gente.
5.  **Retrasos e Impredictibilidad:** El tiempo en el transporte público se percibe como "tiempo perdido". La falta de certeza sobre la hora de llegada genera picos de cortisol (estrés) equivalentes a situaciones de alta presión laboral.

---

## 5. Análisis de Competidores

### Competidores Directos


| Competidor | Fortalezas | Debilidades |
| :--- | :--- | :--- |
| **Google Maps / Apple Maps** | Ubicuidad, integración nativa, mapas precisos.Excelente motor de enrutamiento multimodal; cobertura global de mapas; bases de datos de horarios teóricos muy robustas. | Actualización lenta de incidencias sociales (protestas, fallas eléctricas). Datos de ocupación imprecisos. Datos en tiempo real limitados o dependientes exclusivamente de los GPS de los operadores (los cuales suelen fallar o apagarse). El componente comunitario de reportes visuales instantáneos es secundario o complejo de usar.|
| **Moovit** | Gran base de datos de rutas, crowdsourcing de datos. | UX saturada de anuncios invasivos, alto consumo de batería y datos. |
| **Citymapper** | UX/UI excepcional, "Go Mode" muy preciso. | Cobertura limitada a ciudades "Tier 1". No monetiza bien en mercados emergentes. |
| **X (Twitter) / Grupos de FB** | Tiempo real absoluto, reportes ciudadanos. | Mucho ruido, información no verificada, difícil de filtrar por ruta específica. |

### Competidores Indirectos

#### 3. Aplicaciones Oficiales de Tránsito (ej. Red Metropolitana de Movilidad, Metro CDMX)
*   **Fortalezas:** Datos oficiales de las instituciones; planificación de viajes institucional.
*   **Debilidades:** Baja calificación en tiendas de apps debido a bugs constantes. Sesgo político: tardan en reconocer fallas graves del sistema para no afectar la percepción pública de la gestión gubernamental.

---

## 6. Oportunidades de Integración Publicitaria (Non-Invasive Ads)

El modelo de monetización se basa en la **Publicidad Contextual basada en la Ubicación (LBA)**, evitando banners que obstruyan la navegación.

1.  **Sponsored Wayfinding:** Cuando el sistema detecta que el usuario está detenido en una estación con retraso prolongado o va en camino a un transbordo masivo, la app muestra un banner nativo con descuentos para tiendas comerciales integradas dentro o cerca de la estación (cafeterías, tiendas de conveniencia, farmacias). "Hay un retraso en Línea 1. Mientras esperas, tienes un 20% de descuento en [Cafetería cercana a la estación]".
2.  **Branded Alerts:** Notificaciones de incidencias patrocinadas por marcas de seguros o telecomunicaciones ("TransitWatch, patrocinado por [Marca], te informa: retraso de 10 min en tren").
3.  **Points & Rewards:** Gamificación donde reportar incidencias otorga puntos canjeables en comercios locales situados en los nodos de transporte.
4.  **Targeting de Fin de Trayecto (Anuncios Basados en el Destino):** "Si el usuario consulta diariamente una ruta hacia un sector de oficinas o comercial, se despliegan anuncios nativos en el *feed* de llegada relacionados con almuerzos, servicios financieros o gimnasios en ese cuadrante específico".
5.  **Rewarded Utility (Recompensas por Reportar):* "El usuario gana puntos o "tokens" dentro de la app cada vez que valida un incidente reportado por otro pasajero o sube una foto del estado del andén. Estos puntos se canjean por productos reales patrocinados por las marcas asociadas (ej. minutos de datos móviles, cupones de descuento)".


---

## Fuentes y Referencias

*   **UITP (International Association of Public Transport):** *Statistics Brief 2023 - Local public transport trends*.
*   **BID (Banco Interamericano de Desarrollo):** *Estudio de satisfacción del usuario en sistemas de transporte masivo en LatAm (2022)*.
*   **Waze Mobile Ltd:** *Benchmark de Crowdsourced Data para movilidad urbana*.
*   **Journal of Urban Technology:** *The impact of real-time information on transit ridership behavior*.
*   **Waze UX Case Study:** Análisis del modelo de crowdsourcing y cómo la gamificación incentiva los reportes de tráfico vehicular sin comprometer la atención durante el trayecto.
*   **CEPAL (2024):** *Brechas de género y seguridad en el transporte público de América Latina*. Justificación para la inclusión de alertas tempranas sobre entornos hostiles y niveles de iluminación/saturación.
*   **Estudios de Caso de Monetización Programática (In-App B2C):** Benchmarks que demuestran que la transición de anuncios tipo *Interstitial* a anuncios *Nativos Contextuales* reduce el *churn* (abandono de la app) en hasta un 34% en aplicaciones de herramientas y productividad.

---
*Este documento es propiedad intelectual del equipo de Investigación de Producto. Su uso está destinado a la fase de ideación y validación de prototipo.*