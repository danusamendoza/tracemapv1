# Estrategia de Contenido y UX Writing: TraceMap

**Proyecto:** TraceMap - Monitoreo de Transporte Público  
**Documento:** content.md  
**Versión:** 1.0
**Fecha:** 12 de junio de 2026  
**Autoría:** Especialista en UX Writing y Comunicación Urbana  

---

## 1. Principios de Comunicación

Para guiar al usuario en entornos urbanos caóticos y que TraceMap sea la herramienta de confianza del "Viajero Estratégico", nuestra comunicación debe regirse por cuatro pilares:

*   **Confiabilidad Basada en Datos:** No usamos adjetivos subjetivos (ej. "el metro está terrible"). Usamos hechos y datos (ej. "Retraso de 12 minutos por falla técnica"). La precisión construye autoridad. Si una línea del metro está detenida, informamos lo que está verificado. Usamos datos precisos y un lenguaje objetivo para reducir la incertidumbre de la "caja negra" del transporte urbano.
*   **Accesibilidad Universal:** El lenguaje debe ser comprensible para un estudiante de 18 años y un adulto de 55. Evitamos tecnicismos burocráticos de las agencias de transporte a menos que sean estrictamente necesarios para identificar un lugar. El usuario suele leer la pantalla mientras camina, esquiva multitudes o viaja en un autobús en movimiento. Las frases deben ser cortas, los verbos de acción deben ir al inicio.
*   **Urgencia Controlada (No Alarmista):** Informamos sobre problemas graves sin generar pánico. El objetivo es que el usuario sienta que tiene el control de la situación, no que sea víctima de ella. Una incidencia es un contratiempo, no el fin del mundo. Reemplazamos adjetivos catastróficos (*"Caos total en Línea 1"*) por datos accionables (*"Línea 1 con retraso de 15 minutos. Elige una alternativa"*). El objetivo es bajar los niveles de cortisol del usuario ofreciéndole salidas claras.
*   **Orientación a la Acción:** Cada mensaje de incidencia debe responder a la pregunta implícita del usuario: *¿Y ahora qué hago?* Siempre intentamos ofrecer una alternativa o una estimación de espera.

---

## 2. Tono y Voz

### La Voz de TraceMap
Somos el **"Copiloto Urbano Expertoc, Empático y Ultraeficiente"**. No habla como una autoridad gubernamental distante ni como un amigo demasiado informal que abusa de los modismos. Es esa persona que conoce todos los atajos de la ciudad, que mantiene la calma cuando todo se detiene y que te da la información exacta en el momento preciso para proteger tu tiempo. Siempre tiene un plan B bajo la manga. 

### El Tono Adaptativo (Tone Map)
El tono es **Directo, Empático y Resolutivo**. 
*   **Directo:** En una emergencia, menos es más. Priorizamos la información crítica al inicio de la frase.
*   **Empático:** Reconocemos que un retraso es una molestia. Usamos un lenguaje humano, pero profesional.
*   **Resolutivo:** No solo damos malas noticias; iluminamos el camino hacia la solución.

Mientras la voz permanece constante, el tono cambia según el estado emocional del usuario y el contexto del trayecto:

| Contexto de la Interfaz | Estado Emocional del Usuario | Tono Sugerido | Enfoque de UX Writing |
| :--- | :--- | :--- | :--- |
| **Onboarding y Configuración** | Curioso, relajado, optimista. | Educativo, cercano, ágil. | Explicar el valor del producto sin rodeos y agilizar la fricción técnica. |
| **Flujo Normal (Sin Incidentes)** | Tranquilo, enfocado, rutinario. | Ligero, directo, minimalista. | Validar que todo va bien y dejar el espacio limpio para la utilidad o pautas contextuales de marcas. |
| **Alerta Crítica (Retraso Alto/Cierre)** | Estresado, apurado, frustrado. | Directo, claro, ultra-accionable. | Cero rodeos. Primero el problema, luego el tiempo estimado, inmediatamente la alternativa. |
| **Pantallas de Error / Carga** | Impaciente, propenso al abandono. | Solucionador, empático, transparente. | Explicar brevemente el fallo técnico y ofrecer una acción de salida inmediata. |

---

## 3. Glosario de Términos Clave

Para mantener la consistencia en toda la aplicación, el equipo de diseño y desarrollo utilizará exclusivamente los siguientes términos estandarizados:

*   **Incidencia:** Cualquier evento (técnico, social o climático o de seguridad) que altere el flujo normal programado del transporte público. *(Evitar: Problema, falla, desastre).*
*   **Ruta Alternativa:** Trayecto sugerido por la plataforma que combina otros medios de transporte para evadir una incidencia activa.
*   **Demora Estimada:** Tiempo adicional (en minutos) que el usuario tardará en llegar a su destino respecto al horario normal. El tiempo extra en minutos que el usuario pasará en su trayecto en comparación con un día normal. Se calcula cruzando reportes ciudadanos y datos de GPS.
*   **Alerta Crítica:** Notificación de alta prioridad que implica la suspensión total de un servicio o el cierre físico de una estación en la ruta activa del usuario.
*   **Saturación:** Nivel de densidad humana dentro de un vehículo o andén. Se categoriza en tres niveles visuales y textuales: *Baja* (asientos disponibles), *Media* (de pie, con espacio), *Alta* (capacidad máxima / espacio limitado), *Critica* (espacio insuficiente / buscar otra opción)
*   **Reporte Ciudadano:** Información enviada y validada por otros usuarios en tiempo real en el lugar del evento.
*   **Estado del Servicio:** Resumen general de la operatividad de una red completa.

---

## 4. Microcopy Contextualizado

A continuación, se presentan los textos para los puntos de contacto clave de la interfaz, integrando sutilmente el modelo de monetización.

### 4.1 Botón Principal de Activación de Alertas ((Floating Action Button)
* **Contexto:** El usuario configura su ruta diaria de ida al trabajo y quiere activar el monitoreo en tiempo real en segundo plano.
* **Copy Opción A (Elegido):** `Monitorear mi ruta` (Label) / `Te avisaremos si algo cambia en tu trayecto` (Helper text).
* **Copy Opción B:** `Activar alertas` (Label) / `Alertas en vivo encendidas` (Helper text).
* **Razón de UX:** "Monitorear" denota una acción constante y proactiva por parte de la app. Es claro, genera seguridad y establece la expectativa de que no necesita revisar la app a menos que ocurra algo.

### 4.2 Estado Vacío (Empty State - Cuando el servicio opera normalmente)
* **Contexto:** El usuario abre la app antes de salir de casa y todas las líneas y autobuses funcionan a tiempo. Espacio ideal para una transición publicitaria nativa muy sutil.
* **Copy:** * **Titular:** `Tu ruta está despejada`
    * **Cuerpo:** `Los servicios operan a tiempo. Disfruta el viaje.`
    * **Espacio Contextual de Marca (Ad):** `¿Paso libre? Aprovecha el tiempo y retira un café mediano en [Cafetería X] de la estación con 15% de descuento usando tu app.`
* **Razón de UX:** Alivia la ansiedad de inmediato confirmando el estado óptimo del sistema y aprovecha el estado emocional positivo para introducir un beneficio comercial contextual sin obstruir.

### 4.3 Mensaje de Error de Conectividad (No Internet en el Túnel)
* **Contexto:** El usuario entra al subsuelo o a una zona de alta aglomeración y se queda sin datos móviles mientras intenta actualizar los reportes.
* **Copy:** * **Titular:** `Buscando señal...`
    * **Cuerpo:** `Estamos intentando conectar con los reportes en vivo. Te mostraremos los datos guardados de hace 3 minutos.`
    * **Botón de Acción (CTA):** `Reintentar`
* **Razón de UX:** Evita el alarmismo de *"Sin conexión a internet"*. Decir "Buscando señal" denota que la app sigue trabajando por él. Mostrar los últimos datos guardados reduce la fricción y la sensación de desamparo táctico.

### 4.4 Confirmación Exitosa de Alerta Personalizada
* **Contexto:** Toast o modal corto que aparece justo después de que el usuario programa un horario específico para recibir el estado de su transporte (ej. todos los días a las 07:45 AM).
* **Copy:** * **Cuerpo:** `Monitoreo programado. Mañana a las 7:45 AM sabrás si tu ruta tiene incidencias antes de que salgas.`
* **Razón de UX:** Refuerza el valor de la automatización y del "ahorro de tiempo personal", dándole la certeza de que el producto trabajará por él de manera preventiva.

### 4.5 Onboarding Inicial (Pantalla de Bienvenida)
* **Contexto:** Primera pantalla que ve el usuario tras instalar la aplicación. Necesita entender qué hace la app en menos de 3 segundos.
* **Copy:** * **Titular:** `Anticípate a los retrasos`
    * **Cuerpo:** `Centralizamos los reportes de la comunidad y del transporte público para que decidas tu ruta a tiempo. Sin sorpresas, sin perder minutos.`
    * **Botón de Acción (CTA):** `Empezar a moverme`
* **Razón de UX:** Apela directamente al *Job-to-be-Done* principal: el control del tiempo y la erradicación de las sorpresas desagradables en el trayecto.

### 4.6 Notificación Push de Incidencia Crítica
* **Contexto:** Se suspende el servicio en la línea de Metro que el usuario usa habitualmente, 15 minutos antes de su hora habitual de viaje.
* **Copy:** * **Titular de la Push:** `Alerta Crítica: Línea 1 detenida`
    * **Cuerpo de la Push:** `Retraso estimado de 20 min por falla técnica. Toca aquí para ver 2 rutas alternativas en bus.`
* **Razón de UX:** Comienza con la gravedad del evento ("Alerta Crítica"), localiza el problema de inmediato ("Línea 1 detenida"), cuantifica el dolor ("20 min") y ofrece la solución inmediata mediante la acción de la app. Evita palabras que causen pánico.

### 4.7 Invitación a Compartir Ruta Alternativa
* **Contexto:** El usuario ha encontrado un desvío o ruta alternativa limpia dentro de la app para esquivar una manifestación social. La app le sugiere compartirla con sus compañeros de trabajo o familiares.
* **Copy:** * **Titular:** `¿Vas con alguien más?`
    * **Cuerpo:** `Evita que tus compañeros se queden atrapados. Comparte esta ruta alternativa por WhatsApp con un toque.`
    * **Botón de Acción (CTA):** `Compartir ruta`
* **Razón de UX:** Apela al sentido de comunidad y colaboración urbana ("El Viajero Estratégico"). El texto del helper contextualiza la utilidad social del envío, aumentando la tasa de viralidad orgánica de la herramienta.

### 4.8 Anuncio Contextual (Acompañando una demora)
> **Texto:** La espera será larga (aprox. 20 min).  
> **Cuerpo:** Hay un [Nombre de Negocio] a 100 metros de la estación con WiFi y aire acondicionado.  
> **Botón:** Ver mapa y cupón.

---
*Este documento de estrategia de contenido debe ser la base para el diseño de interfaces (UI) y la configuración de servicios de notificaciones push de TraceMap.*