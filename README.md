# Taskly · Lista de tareas con fotos y ubicación

Aplicación móvil basada en Expo Router (React Native + TypeScript) pensada para evidenciar la evaluación de Unidad 1. Cada tarea pertenece a un usuario autenticado, exige una foto tomada con la cámara y almacena el nombre del lugar donde fue creada.

## Requisitos

- Node.js 18 o superior
- npm 9+ (incluido con Node 18)
- Dispositivo con Expo Go, simulador iOS o emulador Android
- Permisos de cámara y ubicación para probar las funciones multimedia

## Puesta en marcha

```bash
npm install          # instala dependencias
npm run lint         # valida estilos y tipos con eslint-config-expo
npx tsc --noEmit     # (opcional) verificación estricta de TypeScript
npx expo start       # levanta Metro y expone el proyecto
```

Cuando Metro se inicie, escanea el QR con Expo Go o presiona `w` para abrir la versión web. Mantén el teléfono y el computador en la misma red local.

## Funcionalidades clave

### Autenticación y sesiones locales
- Registro e inicio de sesión totalmente offline con normalización de correo.
- Persistencia de los usuarios y de la sesión activa en AsyncStorage.
- Contexto global (`useAuth`) que hidrata el estado antes de renderizar las pantallas protegidas.

### Tareas enriquecidas
- Cada tarea guarda título, descripción, foto obligatoria, nombre del lugar y estado.
- Captura de fotos con `expo-image-picker`, fallback a librería en Web y reemplazo seguro de imágenes anteriores.
- Detección automática del lugar con `expo-location` + `reverseGeocode`, editable manualmente.
- Las imágenes se copian al sandbox del usuario mediante `expo-file-system` y se limpian al eliminar tareas.

### Productividad y métricas
- Filtros con contadores (todas, pendientes, completadas) y ordenamiento automático.
- Banner animado con porcentaje completado y CTA hacia el modal de estadísticas.
- Modal `/modal` con cards informativas, barra de progreso y acción masiva para limpiar completadas.

### Experiencia de usuario
- Animaciones con Reanimated (FadeInDown, FadeOutRight, SlideInDown, springs).
- Feedback háptico en iOS al completar/guardar tareas.
- Contadores de caracteres, validaciones amigables y mensajes contextuales.
- Indicador visual cuando la persistencia está en curso (icono 💾).

## Permisos

- **Cámara**: requerida para capturar la foto de cada tarea. La app muestra un mensaje de error si el permiso se rechaza.
- **Ubicación**: usada para obtener un nombre sugerido del lugar; puedes editarlo manualmente si no deseas otorgar el permiso.

## Scripts útiles

- `npm run start` · inicia Metro con Expo Router.
- `npm run lint` · ejecuta `expo lint` (ESLint + TypeScript).
- `npm run android | ios | web` · abre Expo Go en la plataforma indicada.
- `npm run reset-project` · limpia cachés y reinstala dependencias (script auxiliar).

## Estructura relevante

- `app/_layout.tsx` · monta proveedores globales (Auth + Tasks) y navegación.
- `app/login.tsx` · flujo de registro/inicio completamente tipado.
- `app/(tabs)/index.tsx` · pantalla principal (formulario, filtros, lista, banner y acciones masivas).
- `app/modal.tsx` · resumen de estadísticas y limpieza de tareas completadas.
- `hooks/use-auth.ts` · manejo de usuarios locales, sesión y sign-in/sign-up.
- `hooks/use-tasks.ts` · CRUD por usuario + persistencia y serialización robusta.
- `components/tasks/*` · UI reutilizable (formulario, filtros, lista, stats banner).
- `utils/task-media.ts` · helpers para copiar/eliminar fotos en el sistema de archivos.

## Próximas ideas

- Sincronización remota y copia de seguridad en la nube.
- Etiquetas/categorías y búsqueda avanzada.
- Recordatorios con notificaciones push.
- Compartir listas entre usuarios.

## Recursos útiles

- [Expo Docs](https://docs.expo.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [Async Storage](https://react-native-async-storage.github.io/async-storage/docs/install/)

---

Si necesitas restablecer el estado del proyecto, ejecuta `npm run reset-project` y luego `npm install` para reinstalar dependencias limpias.

## Informe de Cambios y Mejoras (22 Nov 2025)

Se han realizado las siguientes implementaciones y correcciones sobre la base original del proyecto

### 1. Refactorización y Arquitectura
- **Hook `useTaskForm`**: Se extrajo toda la lógica de manejo del formulario (estado, validaciones, cámara, ubicación) desde `index.tsx` hacia un custom hook dedicado (`hooks/use-task-form.ts`). Esto reduce la complejidad del componente visual y facilita el mantenimiento.
- **Scroll Unificado**: Se optimizó la pantalla principal integrando el formulario y los filtros dentro de `ListHeaderComponent` del `FlatList`, permitiendo que toda la interfaz sea desplazable de manera fluida en pantallas pequeñas.

### 2. Nuevas Funcionalidades
- **Búsqueda de Tareas**: Se implementó una barra de búsqueda (`SearchBar`) que permite filtrar tareas en tiempo real por título, descripción o ubicación. La lógica de filtrado se integró directamente en el hook `useTasks`.

### video de las preguntas
