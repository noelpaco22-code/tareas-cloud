# 📋 Tareas Cloud - Sistema de Tareas Colaborativas en Tiempo Real

![Vista previa de la aplicación](https://tareas-cloud-nu.vercel.app/)

---

## 📝 Descripción

**Tareas Cloud** es una aplicación web colaborativa que permite a múltiples usuarios gestionar tareas en **tiempo real**. Cuando un usuario agrega, edita o elimina una tarea, todos los demás usuarios conectados ven los cambios automáticamente, sin necesidad de recargar la página.

Esta aplicación fue desarrollada como parte de la asignatura **Tecnologías Emergentes** (7mo Semestre) de la carrera de **Ingeniería de Sistemas** en la **UAB FIT**, con el objetivo de demostrar el uso de servicios **PaaS** (Plataforma como Servicio) en el desarrollo de software moderno.

---

## 🎯 Objetivos

### Objetivo General
Desarrollar una aplicación web funcional que integre un backend en tiempo real utilizando Supabase como servicio PaaS, gestionar el código fuente con Git y GitHub, y realizar su despliegue en producción mediante Vercel; aplicando los conceptos de Cloud Computing vistos en clase.

### Objetivos Específicos
1. Comprender el rol de PaaS en el ciclo de vida del desarrollo de software.
2. Crear y configurar un proyecto en Supabase como backend gestionado en la nube.
3. Implementar operaciones CRUD y tiempo real con Supabase Realtime.
4. Aplicar control de versiones con Git y colaboración en GitHub.
5. Desplegar y poner en producción la aplicación usando Vercel.
6. Reflexionar sobre las ventajas del modelo PaaS respecto al despliegue tradicional.

---

## ✨ Características

- ✅ Crear nuevas tareas (título + responsable)
- ✅ Marcar tareas como completadas
- ✅ Editar tareas existentes
- ✅ Eliminar tareas
- ✅ **Actualización en tiempo real** (sin recargar la página)
- ✅ Interfaz moderna con efectos neón
- ✅ Diseño responsivo (celular, tablet y computadora)
- ✅ Notificaciones visuales
- ✅ Modales personalizados para editar y eliminar

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Función | Enlace |
|------------|---------|--------|
| **Visual Studio Code** | Editor de código fuente | [code.visualstudio.com](https://code.visualstudio.com) |
| **HTML5 + CSS3 + JavaScript** | Desarrollo frontend | - |
| **Supabase** | Backend en la nube (Base de datos + Auth + Realtime) | [supabase.com](https://supabase.com) |
| **Git** | Control de versiones | [git-scm.com](https://git-scm.com) |
| **GitHub** | Repositorio remoto y colaboración | [github.com](https://github.com) |
| **Vercel** | Despliegue y hosting en la nube | [vercel.com](https://vercel.com) |

---

## 🏗️ Arquitectura de la Aplicación

### Diagrama de Arquitectura Cloud
┌─────────────────┐
│ USUARIOS │
│ (Navegadores) │
└────────┬────────┘
│
▼
┌─────────────────┐
│ VERCEL │
│ (Frontend) │
│ • HTML5 │
│ • CSS3 │
│ • JavaScript │
└────────┬────────┘
│
▼
┌─────────────────────────────────────────┐
│ SUPABASE (Backend) │
│ ┌───────────────────────────────────┐ │
│ │ PostgreSQL Database │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Tabla: tareas │ │ │
│ │ │ • id (UUID) │ │ │
│ │ │ • titulo (TEXT) │ │ │
│ │ │ • responsable (TEXT) │ │ │
│ │ │ • completada (BOOLEAN) │ │ │
│ │ │ • created_at (TIMESTAMP) │ │ │
│ │ └─────────────────────────────┘ │ │
│ └───────────────────────────────────┘ │
│ ┌───────────────────────────────────┐ │
│ │ Tiempo Real (WebSockets) │ │
│ │ • Eventos: INSERT, UPDATE, │ │
│ │ DELETE │ │
│ └───────────────────────────────────┘ │
│ ┌───────────────────────────────────┐ │
│ │ Seguridad (RLS) │ │
│ │ • Políticas de acceso público │ │
│ └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
