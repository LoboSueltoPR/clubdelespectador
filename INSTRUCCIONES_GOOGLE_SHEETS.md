# 📋 Guía: Google Sheets para la Agenda

## ¿Cómo funciona?

Tu página web ahora carga **automáticamente** los eventos desde Google Sheets. Cualquier cambio que hagas en el Sheet se verá reflejado en la web sin necesidad de tocar código.

---

## 📊 Pasos para Configurar

### 1️⃣ Estructura del Google Sheet

Tu Sheet debe tener estas **columnas** (en la primera fila):

| Fecha | Hora | Evento | Lugar | Descripción |
|-------|------|--------|-------|-------------|
| 2026-04-20 | 19:00 | Cine Clásico | Auditorio Central | Una película de oro del cine |
| 2026-04-27 | 20:00 | Concierto | Sala de Conciertos | Música en vivo |

**Formatos importantes:**
- **Fecha**: `YYYY-MM-DD` (ej: 2026-04-20)
- **Hora**: `HH:MM` formato 24h (ej: 19:00)
- **Las demás columnas**: texto libre

### 2️⃣ Compartir el Sheet

1. Abre tu Google Sheet
2. Haz clic en **"Compartir"** (arriba a la derecha)
3. Cambia los permisos a **"Cualquiera con el enlace"**
4. Selecciona **"Visualizador"** como rol
5. ✅ Listo

### 3️⃣ Actualizar el ID del Sheet en el Código

El código actualmente usa este ID:
```javascript
const SHEET_ID = '1RXkacnd3Ig5xm_Vws5bGNWKh4-czpEYrpGq6AJLMIkQ';
```

**Si cambias de Sheet:**

1. Abre tu nuevo Google Sheet
2. Copia la URL:
   ```
   https://docs.google.com/spreadsheets/d/AQUI_ESTA_EL_ID/edit
   ```
3. Extrae el ID (la parte larga entre `/d/` y `/edit`)
4. Abre el archivo `js/agenda-sheets.js`
5. Reemplaza el `SHEET_ID` en la línea 2

---

## 👥 Cómo Múltiples Personas Pueden Editar

1. **Comparte el enlace** del Google Sheet con tu equipo
2. Cada persona puede:
   - ✏️ Editar directamente los eventos
   - ➕ Agregar nuevas filas con eventos
   - ❌ Eliminar eventos
3. Los cambios se ven en la web **automáticamente** (dentro de unos segundos)

---

## ✅ Validación de Datos

El script acepta cualquier formato de fecha que Google Sheets reconozca:
- `2026-04-20`
- `20/04/2026`
- `04-20-2026`
- `April 20, 2026`

⚠️ **Importante**: La fecha DEBE ser válida, si no, el evento no aparecerá.

---

## 🎨 Cómo se Organiza en la Web

Los eventos se agrupen **automáticamente por mes**:
- Si tienes eventos en abril y mayo, aparecerán 2 tabs
- Cada tab muestra los eventos de ese mes
- Los eventos dentro de un mes se ordenan por hora

---

## 🔍 Ver Errores en la Consola

Si algo no funciona:

1. Abre la web en el navegador
2. Presiona **F12** (Herramientas del Desarrollador)
3. Ve a la pestaña **"Consola"**
4. Busca mensajes rojos que digan dónde está el problema

---

## 📝 Ejemplo Completo de Google Sheet

```
Fecha           | Hora  | Evento                    | Lugar              | Descripción
2026-04-20      | 19:00 | Noche de Cine            | Auditorio Central  | Película clásica argentina
2026-04-25      | 20:30 | Concierto de Jazz        | Sala Variedad      | Artistas locales
2026-05-03      | 18:00 | Lectura de Poesía        | Café Literario     | Abierto al público
2026-05-15      | 19:30 | Obra de Teatro           | Teatro Municipal   | Entradas disponibles
```

---

## ❓ Preguntas Frecuentes

### P: ¿Cuánto tarda en actualizar?
**R:** Entre 1-5 segundos después de guardar el Sheet.

### P: ¿Puedo eliminar la columna de Descripción?
**R:** Sí, es opcional. El script busca automáticamente las columnas que existan.

### P: ¿Qué pasa si no completo una columna?
**R:** No hay problema. El Script muestra lo que tiene disponible.

### P: ¿Puedo tener cientos de eventos?
**R:** Sí, sin problemas. El script puede manejar miles de eventos.

### P: ¿Funciona sin internet?
**R:** No, necesita conexión para leer el Google Sheet.

---

## 🚀 Si algo falla

**Reinicia la web**: A veces los navegadores cachean datos. Presiona `Ctrl+Shift+R` (o `Cmd+Shift+R` en Mac) para limpiar el caché.

Si persiste el error, abre la consola (F12) y busca el mensaje de error rojo. Ese mensaje te dirá exactamente qué está mal.

---

**¡Listo!** 🎉 Ahora puedes mantener tu agenda actualizada sin tocar código.
