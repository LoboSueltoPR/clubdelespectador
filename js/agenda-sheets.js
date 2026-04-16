// Google Sheets Integration for Club del Espectador
const SHEET_ID = '1RXkacnd3Ig5xm_Vws5bGNWKh4-czpEYrpGq6AJLMIkQ';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// Fetch and parse CSV from Google Sheets
async function loadAgendaFromSheets() {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    const events = parseCSV(csvText);

    // Group events by month
    const eventsByMonth = groupEventsByMonth(events);

    // Render agenda
    renderAgenda(eventsByMonth);

    console.log('✅ Agenda cargada correctamente desde Google Sheets');
  } catch (error) {
    console.error('❌ Error cargando agenda:', error);
    showFallbackAgenda();
  }
}

// Parse CSV data
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const events = [];

  // Find column indices
  const indices = {
    fecha: headers.findIndex(h => h.toLowerCase().includes('fecha')),
    hora: headers.findIndex(h => h.toLowerCase().includes('hora')),
    evento: headers.findIndex(h => h.toLowerCase().includes('evento')),
    lugar: headers.findIndex(h => h.toLowerCase().includes('lugar')),
    descripcion: headers.findIndex(h => h.toLowerCase().includes('descripcion') || h.toLowerCase().includes('desc'))
  };

  // Parse rows
  for (let i = 1; i < lines.length; i++) {
    const line = parseCSVLine(lines[i]);
    if (line.length > 0 && line[0].trim()) { // Skip empty rows
      events.push({
        fecha: line[indices.fecha]?.trim() || '',
        hora: line[indices.hora]?.trim() || '',
        evento: line[indices.evento]?.trim() || '',
        lugar: line[indices.lugar]?.trim() || '',
        descripcion: line[indices.descripcion]?.trim() || ''
      });
    }
  }

  return events;
}

// Parse CSV line (handle quoted values)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

// Group events by month
function groupEventsByMonth(events) {
  const months = {};

  events.forEach(event => {
    if (!event.fecha) return;

    try {
      const date = new Date(event.fecha);
      const monthKey = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

      if (!months[monthKey]) {
        months[monthKey] = [];
      }

      // Sort by time
      months[monthKey].push(event);
      months[monthKey].sort((a, b) => {
        const timeA = a.hora || '00:00';
        const timeB = b.hora || '00:00';
        return timeA.localeCompare(timeB);
      });
    } catch (error) {
      console.warn('Error parsing date:', event.fecha, error);
    }
  });

  return months;
}

// Render agenda in the page
function renderAgenda(eventsByMonth) {
  const agendaContainer = document.querySelector('.agenda-container');
  if (!agendaContainer) return;

  // Clear existing content
  agendaContainer.innerHTML = '';

  // Get month keys sorted
  const monthKeys = Object.keys(eventsByMonth).sort();

  if (monthKeys.length === 0) {
    agendaContainer.innerHTML = '<p class="text-center" style="padding: 2rem;">No hay eventos programados</p>';
    return;
  }

  // Create tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'agenda-tabs';
  tabsContainer.style.display = 'flex';
  tabsContainer.style.gap = '1rem';
  tabsContainer.style.marginTop = '3%';
  tabsContainer.style.marginBottom = '1.5rem';
  tabsContainer.style.flexWrap = 'wrap';

  monthKeys.forEach((month, index) => {
    const btn = document.createElement('button');
    btn.className = `agenda-tab ${index === 0 ? 'active' : ''}`;
    btn.textContent = month.charAt(0).toUpperCase() + month.slice(1);
    btn.onclick = () => mostrarMesAgenda(month);
    tabsContainer.appendChild(btn);
  });

  agendaContainer.appendChild(tabsContainer);

  // Create content sections
  monthKeys.forEach((month, index) => {
    const section = document.createElement('div');
    section.id = `agenda-${month}`;
    section.className = 'timeline tab-content';
    section.style.display = index === 0 ? 'block' : 'none';

    eventsByMonth[month].forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event';

      const dateTimeDiv = document.createElement('div');
      dateTimeDiv.className = 'date-time';

      const dateP = document.createElement('p');
      dateP.textContent = formatDate(event.fecha);
      dateTimeDiv.appendChild(dateP);

      if (event.hora) {
        const timeP = document.createElement('p');
        timeP.textContent = event.hora + ' HS';
        dateTimeDiv.appendChild(timeP);
      }

      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'details';

      const titleH3 = document.createElement('h3');
      titleH3.textContent = event.evento;
      detailsDiv.appendChild(titleH3);

      if (event.lugar) {
        const lugarP = document.createElement('p');
        lugarP.textContent = event.lugar;
        detailsDiv.appendChild(lugarP);
      }

      if (event.descripcion) {
        const descP = document.createElement('p');
        descP.textContent = event.descripcion;
        descP.style.fontSize = '0.9em';
        descP.style.marginTop = '0.5rem';
        descP.style.opacity = '0.8';
        detailsDiv.appendChild(descP);
      }

      eventDiv.appendChild(dateTimeDiv);
      eventDiv.appendChild(detailsDiv);
      section.appendChild(eventDiv);
    });

    agendaContainer.appendChild(section);
  });
}

// Format date to Spanish format
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

// Show/hide months
function mostrarMesAgenda(month) {
  // Hide all
  document.querySelectorAll('.agenda-container .tab-content').forEach(el => {
    el.style.display = 'none';
  });

  // Remove active class from tabs
  document.querySelectorAll('.agenda-tab').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected
  const selected = document.getElementById(`agenda-${month}`);
  if (selected) {
    selected.style.display = 'block';
  }

  // Add active class to clicked button
  event.target?.classList.add('active');
}

// Fallback: show old hardcoded agenda if sheets fails
function showFallbackAgenda() {
  console.log('Usando agenda con datos locales');
  // The HTML already has the old agenda, so we don't need to do anything
}

// Load on page ready
document.addEventListener('DOMContentLoaded', loadAgendaFromSheets);
