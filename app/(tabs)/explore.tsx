import { StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function InfoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#3b82f6', dark: '#1e40af' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#ffffff"
          name="list.bullet.clipboard.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Información del Proyecto
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Aplicación de lista de tareas desarrollada con Expo y React Native para la evaluación de Unidad 1.
      </ThemedText>
      
      <Collapsible title="✨ Características Principales">
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Autenticación local</ThemedText>: Registro/inicio de sesión offline con almacenamiento seguro en AsyncStorage.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Tareas enriquecidas</ThemedText>: Cada tarea guarda título, descripción, foto obligatoria y nombre del lugar.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Captura multimedia</ThemedText>: Cámara integrada con `expo-image-picker` y reemplazo seguro de imágenes.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Ubicaciones nombradas</ThemedText>: Detección vía `expo-location` + edición manual.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Filtros inteligentes</ThemedText>: Segmentos con contadores para todas, pendientes o completadas.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Persistencia por usuario</ThemedText>: Cada cuenta mantiene su set de tareas, fotos incluidas.
        </ThemedText>
      </Collapsible>

      <Collapsible title="🛠️ Tecnologías Utilizadas">
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Expo SDK ~54</ThemedText>: Framework para desarrollo React Native multiplataforma.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">React Native 0.81</ThemedText>: Interfaz nativa para iOS y Android.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">TypeScript</ThemedText>: Tipado estático para mayor seguridad y mantenibilidad.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">NativeWind (Tailwind CSS)</ThemedText>: Estilos utility-first para React Native.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">AsyncStorage</ThemedText>: Almacenamiento persistente local asíncrono.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Expo Router</ThemedText>: Navegación basada en sistema de archivos.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/">
          <ThemedText type="link">📚 Documentación de Expo</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="📱 Estructura de la App">
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Pantalla Principal (Tareas)</ThemedText>: Formulario de entrada, filtros y lista de tareas con edición inline.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Modal de Estadísticas</ThemedText>: Resumen de productividad con porcentaje de completado y acciones masivas.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Componentes Reutilizables</ThemedText>: TaskForm, TaskList, TaskItem y TaskFilter con props tipadas.
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Hooks personalizados</ThemedText>: useAuth + useTasks gestionan sesión y tareas por usuario.
        </ThemedText>
      </Collapsible>

      <Collapsible title="🎨 Diseño y UX">
        <ThemedText>
          La aplicación utiliza un diseño limpio y moderno con:
        </ThemedText>
        <ThemedText>
          • Paleta de colores consistente con énfasis en azul para acciones primarias.
        </ThemedText>
        <ThemedText>
          • Feedback visual inmediato al interactuar con elementos (opacity, estados completados).
        </ThemedText>
        <ThemedText>
          • Manejo inteligente del teclado con KeyboardAvoidingView.
        </ThemedText>
        <ThemedText>
          • Control de foco automático en formularios para mejor flujo de entrada.
        </ThemedText>
        <ThemedText>
          • Mensajes contextuales cuando no hay tareas o todas están completadas.
        </ThemedText>
      </Collapsible>

      <Collapsible title="🚀 Próximas Mejoras">
        <ThemedText>
          • Sincronización y respaldo en la nube.
        </ThemedText>
        <ThemedText>
          • Etiquetas, búsqueda avanzada y orden personalizable.
        </ThemedText>
        <ThemedText>
          • Recordatorios con notificaciones push y fechas límite.
        </ThemedText>
        <ThemedText>
          • Compartir listas entre usuarios y colaboración en tiempo real.
        </ThemedText>
        <ThemedText>
          • Exportación / importación (CSV, JSON) y analíticas históricas.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
