const SUPABASE_URL = 'https://ohwpulisovqnjmcizify.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9od3B1bGlzb3ZxbmptY2l6aWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzODE2MzQsImV4cCI6MjA5Njk1NzYzNH0.VGZhcn9YPxGvEezufPTFodLHwMOHs7Bg1lHk9D6VlhE';
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para cargar tareas desde la base de datos
async function cargarTareas() {
    const { data: tareas, error } = await db
        .from('tareas')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al cargar:', error);
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
        alert('Por favor, completa todos los campos');
        return;
    }

    await db.from('tareas').insert([{ titulo, responsable }]);
    
    // Limpiar el formulario
    document.getElementById('titulo').value = '';
    document.getElementById('responsable').value = '';
}

// Función para cambiar el estado (pendiente/completada)
window.toggleEstado = async function(id, estadoActual) {
    await db.from('tareas').update({ completada: !estadoActual }).eq('id', id);
}

// Función para editar una tarea
window.editarTarea = async function(id) {
    // Obtener los valores actuales de la tarea
    const tituloActual = document.getElementById(`titulo-${id}`).textContent;
    const responsableActual = document.getElementById(`responsable-${id}`).textContent.replace('Responsable: ', '');
    
    // Crear un prompt personalizado con HTML
    const nuevoTitulo = prompt('✏️ Editar título de la tarea:', tituloActual);
    if (nuevoTitulo !== null && nuevoTitulo.trim() !== '') {
        const nuevoResponsable = prompt('👤 Editar responsable:', responsableActual);
        if (nuevoResponsable !== null && nuevoResponsable.trim() !== '') {
            // Actualizar en Supabase
            await db.from('tareas').update({ 
                titulo: nuevoTitulo.trim(), 
                responsable: nuevoResponsable.trim() 
            }).eq('id', id);
        } else if (nuevoResponsable !== null) {
            alert('El responsable no puede estar vacío');
        }
    } else if (nuevoTitulo !== null) {
        alert('El título no puede estar vacío');
    }
}

// Función para eliminar una tarea
window.eliminarTarea = async function(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        await db.from('tareas').delete().eq('id', id);
    }
}

// --- TIEMPO REAL: Escucha cambios en la base de datos ---
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
