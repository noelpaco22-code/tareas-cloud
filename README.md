# 📋 Tareas Cloud - Sistema de Tareas Colaborativas en Tiempo Real

![Vista previa de la aplicación](https://tareas-cloud-nu.vercel.app/)

## 🚀 Descripción

Aplicación web que permite a múltiples usuarios **crear, completar y eliminar tareas** en **tiempo real**. Cuando un usuario agrega o modifica una tarea, todos los demás que tengan la aplicación abierta la ven automáticamente, sin necesidad de recargar la página.

Este proyecto fue desarrollado como parte de la asignatura **Tecnologías Emergentes** - UAB FIT, demostrando el uso de servicios **PaaS** (Plataforma como Servicio) en la nube.

---

## ✨ Características

- ✅ Crear nuevas tareas (título + responsable)
- ✅ Marcar tareas como completadas
- ✅ Editar tareas existentes
- ✅ Eliminar tareas
- ✅ **Actualización en tiempo real** (sin recargar la página)
- ✅ Interfaz moderna con efectos neón
- ✅ Diseño responsivo (funciona en celular, tablet y computadora)
- ✅ Notificaciones visuales
- ✅ Modales personalizados para editar y eliminar

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | ¿Para qué? |
|------------|------------|
| **HTML5** | Estructura de la página |
| **CSS3** | Estilos, animaciones y efectos neón |
| **JavaScript** | Lógica de la aplicación |
| **Supabase** | Base de datos en la nube + tiempo real (PaaS) |
| **Git** | Control de versiones |
| **GitHub** | Repositorio remoto |
| **Vercel** | Despliegue en producción (hosting) |

---

## 🏗️ Arquitectura de la Aplicación

La aplicación sigue una arquitectura **cliente-servidor** moderna:
┌─────────────────────────────────────────────────────────────────┐
│ USUARIO │
│ (Navegador Web) │
└─────────────────────────┬───────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (Vercel) │
│ HTML + CSS + JavaScript │
│ Interfaz de usuario │
└─────────────────────────┬───────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (Supabase) │
│ ┌─────────────────────────┐ │
│ │ Base de Datos │ │
│ │ PostgreSQL │ │
│ │ (Tabla: tareas) │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Tiempo Real │ │
│ │ (WebSockets) │ │
│ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
