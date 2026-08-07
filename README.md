# Simulador de Atención en Servicios Escolares

Aplicación web educativa e interactiva diseñada para la capacitación del personal de Servicios Escolares bajo el marco normativo de la UNAM.

## 🚀 Características
- **Zero-Dependency:** Desarrollado en JavaScript Vanilla, HTML5 y CSS3 puro. Sin librerías externas ni necesidad de comandos `npm install`.
- **Ejecución Local Directa:** Funciona al abrir `index.html` en cualquier navegador web moderno.
- **Diseño Responsivo:** Adaptado a computadoras, tabletas y teléfonos móviles con la paleta de colores oficial UNAM (Azul y Oro).
- **Gamificación Educativa:** Incluye barra de progreso, sistema de puntaje acumulativo y retroalimentación inmediata.

## 📦 Instrucciones de Instalación y Ejecución Local

1. Descarga o clona la carpeta del proyecto en tu equipo local.
2. Agrega los archivos multimedia necesarios en las carpetas `images/` y `audio/` respetando los nombres definidos en la estructura.
3. Para ejecutar la aplicación:
   - **Opción A (Recomendada para evitar restricciones CORS en peticiones `fetch` de archivos JSON locales):** Abre la carpeta desde VS Code y utiliza la extensión **Live Server**, o mediante un servidor HTTP simple de Python ejecutando dentro de la carpeta:
     ```bash
     python -m http.server 8000
     ```
     E ingresa a `http://localhost:8000` en tu navegador.
   - **Opción B:** Si tu navegador tiene habilitadas las lecturas locales, haz doble clic sobre el archivo `index.html`.

## ➕ Guía de Extensión: Agregar Nuevos Casos y Preguntas

### Para agregar un nuevo Alumno/Caso:
1. Abre el archivo `data/casos.json`.
2. Añade un nuevo objeto JSON al final del arreglo especificando un `id` único:
   ```json
   {
     "id": 3,
     "nombre": "María Fernanda Ruiz",
     "imagen": "images/estudiante_maria.png",
     "audio": "audio/maria.mp3",
     "descripcion": "Solicita revalidación de materias por cambio de carrera.",
     "estatus_academico": "Cambio de Carrera",
     "problema": "Discrepancia en las claves del plan de estudios 2020 vs 2024.",
     "solicitud": "Dictamen de equivalencia de asignaturas."
   }