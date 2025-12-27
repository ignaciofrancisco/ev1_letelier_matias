# Taskly · Lista de tareas con fotos y ubicación

Aplicación móvil desarrollada con **Expo Router (React Native + TypeScript)**, creada como evidencia de la **Evaluación de la Unidad 1**. El proyecto demuestra el uso de **estado en React**, **hooks personalizados**, **contexto global**, y **APIs nativas** como cámara y ubicación.

Cada tarea pertenece a un usuario autenticado, requiere una foto tomada con la cámara del dispositivo y guarda el nombre del lugar donde fue creada.

---

## Objetivo del proyecto

El objetivo principal de Taskly es demostrar:

* El manejo de **estado local y global en React** usando `useState`.
* El uso de **hooks personalizados** para separar lógica y presentación.
* La implementación de **autenticación** con persistencia local.
* El consumo de **APIs nativas** (cámara, ubicación y sistema de archivos).
* Una arquitectura ordenada y mantenible.

---

## Requisitos

* Node.js 18 o superior
* npm 9+ (incluido con Node 18)
* Dispositivo con Expo Go, simulador iOS o emulador Android
* Permisos de cámara y ubicación habilitados

---

## Puesta en marcha

```bash
npm install          # instala dependencias
npm run lint         # valida estilos y tipos
npx tsc --noEmit     # verificación de TypeScript (opcional)
npx expo start       # inicia el proyecto
```

Al iniciar Metro, escanea el código QR con **Expo Go** o presiona `w` para abrir la versión web.

---

## Funcionalidades clave

### 1. Autenticación y manejo de estado global

* Registro e inicio de sesión de usuarios.
* Persistencia de sesión con **AsyncStorage**.
* Uso de **Context + hook `useAuth`** para manejar el estado global de autenticación.

Estados principales:

* `user`: usuario autenticado
* `loading`: indica si la sesión se está cargando

Cada vez que estos estados cambian, **React vuelve a renderizar la interfaz automáticamente**, sin recargar la aplicación.

### 2. Demostración práctica del estado en React

En la pantalla de login se utilizan múltiples estados con `useState`:

* `email` y `password`: controlan los inputs del formulario
* `error`: maneja mensajes de error
* `submitting`: controla el estado del botón
* `loading` y `user`: provienen del contexto global

Como prueba visible, se muestran los valores de `loading` y `user` en pantalla, demostrando que al cambiar el estado, la vista se actualiza automáticamente.

---

### 3. Gestión de tareas

* CRUD completo de tareas por usuario.

* Cada tarea incluye:

  * Título
  * Descripción
  * Foto obligatoria
  * Ubicación (nombre del lugar)
  * Estado (pendiente / completada)

* Persistencia local por usuario con AsyncStorage.

---

### 4. Uso de APIs nativas

* **Cámara**: captura de fotos con `expo-image-picker`.
* **Ubicación**: obtención automática del lugar con `expo-location` y `reverseGeocode`.
* **Sistema de archivos**: manejo seguro de imágenes con `expo-file-system`.

Estas funcionalidades demuestran que la aplicación es **nativa**, ya que interactúa directamente con capacidades del dispositivo.

---

### 5. Experiencia de usuario

* Animaciones con Reanimated.
* Feedback visual e interactivo.
* Validaciones de formularios en tiempo real.
* Indicadores de carga y persistencia.

---

## Permisos

* **Cámara**: obligatoria para crear tareas.
* **Ubicación**: usada para sugerir el nombre del lugar (editable).

---

## Scripts disponibles

* `npm run start` · inicia el proyecto
* `npm run lint` · análisis de código
* `npm run android | ios | web` · abre la app en la plataforma indicada
* `npm run reset-project` · limpia cachés y dependencias

---

## Estructura del proyecto

* `app/_layout.tsx` · proveedores globales y navegación
* `app/login.tsx` · flujo de autenticación
* `app/(tabs)/index.tsx` · pantalla principal de tareas
* `app/modal.tsx` · estadísticas y acciones masivas
* `hooks/use-auth.ts` · autenticación y estado global
* `hooks/use-tasks.ts` · gestión de tareas
* `hooks/use-task-form.ts` · lógica del formulario
* `components/*` · componentes reutilizables
* `utils/*` · utilidades y helpers

---

## Videos demostrativos

* **Video funcionamiento general**:
  https://www.youtube.com/shorts/dkvcrW-PZy8


* **Video respuestas conceptuales**:
https://youtu.be/pzGMf6ItHug

---

## Conclusión

Taskly demuestra el uso correcto del **estado en React**, la separación de responsabilidades mediante hooks personalizados y el consumo de APIs nativas. El proyecto cumple con los objetivos de la Unidad 1 y evidencia una aplicación móvil funcional, ordenada y escalable.

---

Si es necesario restablecer el proyecto, ejecutar `npm run reset-project` y luego `npm install`.
