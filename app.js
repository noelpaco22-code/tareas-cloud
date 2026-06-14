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
    
    notificacion.innerHTML = `
        <span class="notificacion-mensaje">${mensaje}</span>
        <button class="notificacion-cerrar">CERRAR</button>
    `;
    
    container.appendChild(notificacion);
    
    const botonCerrar = notificacion.querySelector('.notificacion-cerrar');
    botonCerrar.addEventListener('click', () => {
        notificacion.remove();
    });
    
    setTimeout(() => {
        if (notificacion && notificacion.remove) {
            notificacion.remove();
        }
    }, 3000);
}

// ==================== CRUD DE TAREAS ====================

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

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

window.agregarTarea = async function() {
    const titulo = document.getElementById('titulo').value.trim();
    const responsable = document.getElementById('responsable').value.trim();

    if (!titulo || !responsable) {
        mostrarNotificacion('Completa todos los campos', 'warning');
        return;
    }

    const { error } = await db.from('tareas').insert([{ titulo, responsable }]);
    
    if (!error) {
        mostrarNotificacion(`Tarea "${titulo}" agregada correctamente`, 'exito');
        document.getElementById('titulo').value = '';
        document.getElementById('responsable').value = '';
    } else {
        mostrarNotificacion('Error al agregar la tarea', 'error');
    }
}

window.toggleEstado = async function(id, estadoActual) {
    const nuevaEstado = !estadoActual;
    const accion = nuevaEstado ? 'completada' : 'reabierta';
    
    const { error } = await db.from('tareas').update({ completada: nuevaEstado }).eq('id', id);
    
    if (!error) {
        mostrarNotificacion(`Tarea marcada como ${accion}`, 'info');
    }
}

// ==================== EDITAR CON MODAL ====================
let tareaIdEditando = null;

window.editarTarea = function(id) {
    tareaIdEditando = id;
    
    const tituloActual = document.getElementById(`titulo-${id}`).textContent;
    const responsableActual = document.getElementById(`responsable-${id}`).textContent.replace('Responsable: ', '');
    
    document.getElementById('modal-titulo').value = tituloActual;
    document.getElementById('modal-responsable').value = responsableActual;
    
    const modal = document.getElementById('modal-editar');
    modal.style.display = 'flex';
}

function cerrarModal() {
    const modal = document.getElementById('modal-editar');
    modal.style.display = 'none';
    tareaIdEditando = null;
}

window.guardarEdicion = async function() {
    if (!tareaIdEditando) return;
    
    const nuevoTitulo = document.getElementById('modal-titulo').value.trim();
    const nuevoResponsable = document.getElementById('modal-responsable').value.trim();
    
    if (!nuevoTitulo || !nuevoResponsable) {
        mostrarNotificacion('Completa todos los campos', 'warning');
        return;
    }
    
    const { error } = await db.from('tareas').update({ 
        titulo: nuevoTitulo, 
        responsable: nuevoResponsable 
    }).eq('id', tareaIdEditando);
    
    if (!error) {
        mostrarNotificacion('Tarea editada correctamente', 'exito');
        cerrarModal();
    } else {
        mostrarNotificacion('Error al editar la tarea', 'error');
    }
}

// ==================== ELIMINAR CON MODAL ====================
let tareaIdEliminar = null;
let tareaTituloEliminar = '';

window.eliminarTarea = function(id) {
    tareaIdEliminar = id;
    tareaTituloEliminar = document.getElementById(`titulo-${id}`).textContent;
    
    const infoDiv = document.getElementById('tarea-eliminar-info');
    if (infoDiv) {
        infoDiv.textContent = `"${tareaTituloEliminar}"`;
    }
    
    const modal = document.getElementById('modal-eliminar');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function cerrarModalEliminar() {
    const modal = document.getElementById('modal-eliminar');
    if (modal) {
        modal.style.display = 'none';
    }
    tareaIdEliminar = null;
    tareaTituloEliminar = '';
}

window.confirmarEliminar = async function() {
    if (!tareaIdEliminar) return;
    
    const { error } = await db.from('tareas').delete().eq('id', tareaIdEliminar);
    
    if (!error) {
        mostrarNotificacion(`Tarea "${tareaTituloEliminar}" eliminada correctamente`, 'exito');
        cerrarModalEliminar();
    } else {
        mostrarNotificacion('Error al eliminar la tarea', 'error');
        cerrarModalEliminar();
    }
}

// Cerrar modales al hacer clic fuera
document.addEventListener('click', function(event) {
    const modalEditar = document.getElementById('modal-editar');
    if (modalEditar && event.target === modalEditar) {
        cerrarModal();
    }
    
    const modalEliminar = document.getElementById('modal-eliminar');
    if (modalEliminar && event.target === modalEliminar) {
        cerrarModalEliminar();
    }
});

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
