const SUPABASE_URL = 'https://ohwpulisovqnjmcizify.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9od3B1bGlzb3ZxbmptY2l6aWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzODE2MzQsImV4cCI6MjA5Njk1NzYzNH0.VGZhcn9YPxGvEezufPTFodLHwMOHs7Bg1lHk9D6VlhE';
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== NOTIFICACIONES ====================
function mostrarNotificacion(mensaje, tipo = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    
    // Iconos según el tipo
    let icono = '📌';
    if (tipo === 'exito') icono = '✅';
    if (tipo === 'error') icono = '❌';
    if (tipo === 'info') icono = 'ℹ️';
    if (tipo === 'warning') icono = '⚠️';
    
    notificacion.innerHTML = `
        <span class="notificacion-icono">${icono}</span>
        <span class="notificacion-mensaje">${mensaje}</span>
        <button class="notificacion-cerrar" onclick="this.parentElement.remove()">✖</button>
    `;
    
    container.appendChild(notificacion);
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        if (notificacion && notificacion.remove) {
            notificacion.remove();
        }
    }, 3000);
}

// ==================== CRUD DE TAREAS ====================

// Función para cargar tareas desde la base de datos
async function cargarTareas() {
    const { data: tareas, error } = await db
        .from('tareas')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al cargar:', error);
        mostrarNotificacion('Error al cargar las tareas', 'error');
        return;
    }
    renderizarTareas(tareas);
}

// Función para mostrar las tareas en la pantalla
function renderizarTareas(tareas) {
    const contenedor = document.getElementById('tareas-container');
    const contadorSpan = document.getElementById('contador');
    contadorSpan.textContent = `(${tareas.length})`;

    if (tareas.length === 0) {
        contenedor.innerHTML = '<p class="vacio">No hay tareas aún. ¡Crea una!</p>';
        return;
    }

    let html = '';
    for (const t of tareas) {
        const claseCompletada = t.completada ? 'tarea completada' : 'tarea';
        const textoBoton = t.completada ? 'Pendiente' : 'Completar';

        html += `
            <div class="${claseCompletada}" id="tarea-${t.id}">
                <div class="tarea-info">
                    <strong id="titulo-${t.id}">${escapeHtml(t.titulo)}</strong>
                    <span id="responsable-${t.id}">Responsable: ${escapeHtml(t.responsable)}</span>
                </div>
                <div class="tarea-acciones">
                    <button onclick="toggleEstado('${t.id}', ${t.completada})">${textoBoton}</button>
                    <button class="btn-editar" onclick="editarTarea('${t.id}')">✏️ Editar</button>
                    <button class="btn-eliminar" onclick="eliminarTarea('${t.id}')">Eliminar</button>
                </div>
            </div>
        `;
    }
    contenedor.innerHTML = html;
}

// Función para evitar problemas con caracteres especiales
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Función para agregar una nueva tarea
window.agregarTarea = async function() {
    const titulo = document.getElementById('titulo').value.trim();
    const responsable = document.getElementById('responsable').value.trim();

    if (!titulo || !responsable) {
        mostrarNotificacion('❌ Completa todos los campos', 'warning');
        return;
    }

    const { error } = await db.from('tareas').insert([{ titulo, responsable }]);
    
    if (!error) {
        mostrarNotificacion(`✅ Tarea "${titulo}" agregada correctamente`, 'exito');
        // Limpiar el formulario
        document.getElementById('titulo').value = '';
        document.getElementById('responsable').value = '';
    } else {
        mostrarNotificacion('❌ Error al agregar la tarea', 'error');
    }
}

// Función para cambiar el estado (pendiente/completada)
window.toggleEstado = async function(id, estadoActual) {
    const nuevaEstado = !estadoActual;
    const accion = nuevaEstado ? 'completada' : 'reabierta';
    
    const { error } = await db.from('tareas').update({ completada: nuevaEstado }).eq('id', id);
    
    if (!error) {
        mostrarNotificacion(`📋 Tarea marcada como ${accion}`, 'info');
    }
}

// Función para editar una tarea
window.editarTarea = async function(id) {
    const tituloActual = document.getElementById(`titulo-${id}`).textContent;
    const responsableActual = document.getElementById(`responsable-${id}`).textContent.replace('Responsable: ', '');
    
    const nuevoTitulo = prompt('✏️ Editar título de la tarea:', tituloActual);
    if (nuevoTitulo !== null && nuevoTitulo.trim() !== '') {
        const nuevoResponsable = prompt('👤 Editar responsable:', responsableActual);
        if (nuevoResponsable !== null && nuevoResponsable.trim() !== '') {
            const { error } = await db.from('tareas').update({ 
                titulo: nuevoTitulo.trim(), 
                responsable: nuevoResponsable.trim() 
            }).eq('id', id);
            
            if (!error) {
                mostrarNotificacion(`✏️ Tarea editada correctamente`, 'exito');
            }
        } else if (nuevoResponsable !== null) {
            mostrarNotificacion('El responsable no puede estar vacío', 'warning');
        }
    } else if (nuevoTitulo !== null) {
        mostrarNotificacion('El título no puede estar vacío', 'warning');
    }
}

// Función para eliminar una tarea
window.eliminarTarea = async function(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        const { error } = await db.from('tareas').delete().eq('id', id);
        if (!error) {
            mostrarNotificacion('🗑️ Tarea eliminada correctamente', 'exito');
        }
    }
}

// ==================== TIEMPO REAL ====================
db.channel('tareas-canal')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tareas' }, 
        () => {
            console.log('¡Cambio detectado! Recargando tareas...');
            cargarTareas();
        }
    )
    .subscribe();

// Cargar las tareas al iniciar la página
cargarTareas();
