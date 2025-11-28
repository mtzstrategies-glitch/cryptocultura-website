# 🚀 CRYPTOCULTURA - Landing Page + Sistema de Automatización

Sitio web completo para **CRYPTOCULTURA** con sistema automatizado de captura de leads, gestión de becas y procesamiento de pagos.

---

## 📋 **Tabla de Contenidos**

1. [Características Principales](#características-principales)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Configuración de Backend](#configuración-de-backend)
5. [URLs y Enlaces Importantes](#urls-y-enlaces-importantes)
6. [Cómo Funciona](#cómo-funciona)
7. [Próximos Pasos](#próximos-pasos)

---

## ✨ **Características Principales**

### **Frontend (Landing Page):**
- ✅ Diseño moderno y responsive
- ✅ Hero section con video de fondo
- ✅ 3 paquetes de productos (eBook, Consultoría, Programa Intensivo)
- ✅ Sistema de testimonios
- ✅ FAQ interactivo
- ✅ Formularios de captura de leads
- ✅ Integración con Stripe Checkout

### **Backend (Automatización):**
- ✅ Google Apps Script para webhooks
- ✅ Envío automático de emails
- ✅ Almacenamiento en Google Sheets
- ✅ Integración con Stripe API
- ✅ Sistema de gestión de becas

---

## 📁 **Estructura del Proyecto**

```
/
├── index.html              # Página principal (landing page)
├── beca.html              # Página del formulario de beca
├── terminos-beca.html     # Términos y condiciones de la beca
├── styles.css             # Estilos principales
├── script.js              # JavaScript principal (Lead Magnet + Watchlist)
├── faq.js                 # JavaScript para FAQ interactivo
├── js/
│   └── magic-button.js    # Animación del botón mágico
├── assets/
│   └── hero section.mp4   # Video de fondo del hero
├── README.md              # Este archivo
└── APPS_SCRIPT_*.gs       # Archivos de Google Apps Script
```

---

## 🎯 **Funcionalidades Implementadas**

### **1. Lead Magnet: "Las 5 Preguntas Anti-Humo"**

**Ubicación:** `index.html` - Sección "Educación Crypto para Principiantes"

**Flujo:**
1. Usuario ingresa nombre y email
2. Sistema envía datos a Google Apps Script
3. Datos se guardan en Google Sheet (pestaña "Lead Magnet")
4. Email automático con acceso a la guía
5. Modal de confirmación se muestra al usuario

**Email enviado:**
- Asunto: "Tu Guia: Las 5 Preguntas Anti-Humo"
- Remitente: CRYPTOCULTURA
- Contenido: Link a guía en Heyzine
- URL: https://heyzine.com/flip-book/93bf96befa.html

---

### **2. Watchlist CryptoCultura (113 Cryptos)**

**Ubicación:** `index.html` - Sección "CTA Watchlist"

**Flujo:**
1. Usuario ingresa nombre y email
2. Sistema envía datos a Google Apps Script
3. Datos se guardan en Google Sheet (pestaña "Watchlist Leads")
4. Email automático con link al Google Sheet
5. Mensaje de éxito inline

**Email enviado:**
- Asunto: "Tu Watchlist Crypto: 113 Proyectos Analizados"
- Remitente: CRYPTOCULTURA
- Contenido: Link al Google Sheet con 113 cryptos analizadas
- URL: https://docs.google.com/spreadsheets/d/14qTpC4UKi9cXM5Ms04CWZVIrNY7bjk18SUYDTg6erzg/edit?usp=sharing

---

### **3. Beca CryptoCultura (Scholarship)**

**Ubicación:** `beca.html` - Formulario completo

**Flujo:**
1. Usuario llena formulario extenso:
   - Información básica (nombre, email, país, zona horaria, nivel)
   - Objetivo 30 días (mínimo 150 caracteres)
   - Análisis método 5 preguntas (mínimo 200 caracteres)
   - Horas disponibles por semana
   - Plan de acción primeras 48h (mínimo 100 caracteres)
2. Validación de campos y caracteres mínimos
3. Envío via iframe (bypass CORS)
4. Datos guardados en Google Sheet (pestaña "Beca Applications")
5. Email de confirmación automático
6. Mensaje de éxito en página

**Email enviado:**
- Asunto: "Aplicacion Recibida - Beca CryptoCultura"
- Remitente: CRYPTOCULTURA
- Timeline: Día 12 del mes (cierre y anuncio)
- Criterios de evaluación: 100 puntos

**Campos guardados en Google Sheet:**
- Timestamp
- Nombre
- Email
- País
- Zona Horaria
- Nivel de experiencia
- Objetivo 30 días
- Análisis 5 Preguntas
- Horas/semana
- Primeras 48h

---

### **4. Sistema de Pagos (Stripe)**

**Productos disponibles:**

#### **eBook - "La Nueva Economía Digital"**
- Precio: $49.99 USD
- Payment Link: https://buy.stripe.com/00wcN66Ef4M518c1c3dfG00
- Contenido: eBook en flipbook con contraseña
- URL eBook: https://heyzine.com/flip-book/896f4c87cd.html
- Contraseña: CRYPTO2025

#### **Consultoría 2x45**
- Precio: $297 USD
- Payment Link: https://buy.stripe.com/9B69AU2nZ2DX0483kbdfG01
- Contenido: 2 sesiones de 45 min vía Zoom
- Calendly: https://calendly.com/mtzstrategies/consultoria-2x45

#### **Programa Intensivo (6 semanas)**
- Precio: $997 USD
- Payment Link: https://buy.stripe.com/4gMaEY1jVdiBg369IzdfG02
- Contenido: 6 semanas de formación intensiva
- Calendly: https://calendly.com/mtzstrategies/programa-intensivo-6-semanas

**Flujo de compra:**
1. Usuario hace clic en botón "Comprar"
2. Redirige a Stripe Checkout
3. Usuario completa pago
4. Stripe envía webhook a Google Apps Script
5. Sistema envía email con acceso al producto
6. Datos guardados en Google Sheet (pestaña "Compras")

---

## 🔧 **Configuración de Backend**

### **Google Apps Script**

**Proyecto:** `CRYPTOCULTURA - LEADS`

**URL del Webhook:**
```
https://script.google.com/macros/s/AKfycbyrtAwLecXv5Z3mkr5LQ4kdG6EHKK6TqxGSFCLPnvMPhKTUNpkzEPZE-oQlLTA-WfnbrQ/exec
```

**Versión actual:** v14 - Remitente CRYPTOCULTURA para Beca

**Archivo principal:** `BecaIframe.gs` (580 líneas)

**Configuración (CONFIG object):**
```javascript
{
  stripeSecretKey: 'sk_live_51QYLc9P7zle3rDWn...',
  emailFrom: 'CRYPTOCULTURA <noreply@cryptocultura.com>',
  sheetIdLeadMagnet: '1EciTyz2ZxrfTlRh8smobJ9T-HjZhkeXNsMsIezjaqS0',
  sheetIdWatchlist: '1EciTyz2ZxrfTlRh8smobJ9T-HjZhkeXNsMsIezjaqS0',
  sheetIdCompras: '1EciTyz2ZxrfTlRh8smobJ9T-HjZhkeXNsMsIezjaqS0',
  sheetIdBeca: '1EciTyz2ZxrfTlRh8smobJ9T-HjZhkeXNsMsIezjaqS0',
  leadMagnetPdfUrl: 'https://heyzine.com/flip-book/93bf96befa.html',
  ebookFlipbookUrl: 'https://heyzine.com/flip-book/896f4c87cd.html',
  ebookPassword: 'CRYPTO2025'
}
```

### **Google Sheets**

**Spreadsheet ID:** `1EciTyz2ZxrfTlRh8smobJ9T-HjZhkeXNsMsIezjaqS0`

**URL:** https://docs.google.com/spreadsheets/d/1EciTyz2ZxrfTlRh8smobJ9T-HjZhkeXNsMsIezjaqS0/edit

**Pestañas creadas automáticamente:**
- `Lead Magnet` - Captura de leads (Las 5 Preguntas)
- `Watchlist Leads` - Leads del Watchlist
- `Compras` - Transacciones de Stripe
- `Beca Applications` - Aplicaciones de becas

---

## 🔗 **URLs y Enlaces Importantes**

### **Recursos externos:**

| Recurso | URL |
|---------|-----|
| **Lead Magnet PDF** | https://heyzine.com/flip-book/93bf96befa.html |
| **Watchlist Google Sheet** | https://docs.google.com/spreadsheets/d/14qTpC4UKi9cXM5Ms04CWZVIrNY7bjk18SUYDTg6erzg/edit |
| **eBook Flipbook** | https://heyzine.com/flip-book/896f4c87cd.html |
| **Calendly Consultoría** | https://calendly.com/mtzstrategies/consultoria-2x45 |
| **Calendly Programa** | https://calendly.com/mtzstrategies/programa-intensivo-6-semanas |

### **Redes Sociales:**

| Red Social | Handle | URL |
|-----------|--------|-----|
| **Instagram** | @CryptoCultura_io | https://www.instagram.com/CryptoCultura_io |
| **YouTube** | @CryptoCultura_io | https://www.youtube.com/@CryptoCultura_io |
| **TikTok** | @cryptocultura.io | https://www.tiktok.com/@cryptocultura.io |
| **LinkedIn** | /company/cryptocultura | https://www.linkedin.com/company/cryptocultura |

---

## 🔄 **Cómo Funciona**

### **Flujo de Lead Magnet/Watchlist:**

```
Usuario llena formulario
    ↓
JavaScript crea formulario temporal
    ↓
Envío via iframe oculto (bypass CORS)
    ↓
Google Apps Script recibe datos (doPost)
    ↓
Guarda en Google Sheet
    ↓
Envía email automático (MailApp)
    ↓
Retorna éxito
    ↓
Usuario ve mensaje de confirmación
```

### **Flujo de Beca:**

```
Usuario llena formulario extenso (beca.html)
    ↓
Validación de caracteres mínimos:
  - Objetivo: 150 caracteres
  - Análisis: 200 caracteres
  - Primeras 48h: 100 caracteres
    ↓
JavaScript crea formulario con campos ocultos
    ↓
Envío via iframe (bypass CORS)
    ↓
Google Apps Script detecta type='beca'
    ↓
saveBecaApplication() guarda 10 campos
    ↓
sendBecaConfirmationEmail() envía confirmación
    ↓
Usuario ve mensaje: "Resultados: Día 12 del mes"
```

### **Flujo de Compra (Stripe):**

```
Usuario hace clic en "Comprar"
    ↓
Redirige a Stripe Checkout
    ↓
Completa pago
    ↓
Stripe envía webhook a Apps Script
    ↓
Apps Script obtiene datos de Stripe API
    ↓
Guarda en Google Sheet (pestaña Compras)
    ↓
Envía email según producto:
  - eBook: Link + contraseña
  - Consultoría: Link a Calendly
  - Programa: Link a Calendly
```

---

## 📊 **Estructura de Datos (Google Sheets)**

### **Lead Magnet:**
| Timestamp | Nombre | Email |
|-----------|--------|-------|

### **Watchlist Leads:**
| Timestamp | Nombre | Email |
|-----------|--------|-------|

### **Compras:**
| Timestamp | Nombre | Email | Producto | Monto | Moneda |
|-----------|--------|-------|----------|-------|--------|

### **Beca Applications:**
| Timestamp | Nombre | Email | País | Zona Horaria | Nivel | Objetivo 30 días | Análisis 5 Preguntas | Horas/semana | Primeras 48h |
|-----------|--------|-------|------|--------------|-------|------------------|---------------------|--------------|--------------|

---

## 🚀 **Deploy**

### **Para publicar la página:**

1. Ve a la pestaña **"Publish"** en este editor
2. Haz clic en **"Deploy"**
3. El sistema generará una URL pública
4. Comparte esa URL con tus usuarios

### **Archivos necesarios para el deploy:**
- ✅ index.html
- ✅ beca.html
- ✅ terminos-beca.html
- ✅ styles.css
- ✅ script.js
- ✅ faq.js
- ✅ js/magic-button.js
- ✅ assets/hero section.mp4

---

## ✅ **Testing Checklist**

### **Pre-Deploy:**
- [x] Lead Magnet funciona correctamente
- [x] Watchlist funciona correctamente
- [x] Beca funciona correctamente
- [x] Emails se envían con remitente "CRYPTOCULTURA"
- [x] Datos se guardan en Google Sheet
- [x] Botones de Stripe funcionan
- [x] Timeline de Beca dice "Día 12"
- [x] Validación de caracteres mínimos funciona
- [ ] Todos los enlaces externos funcionan
- [ ] Payment Links de Stripe están activos

### **Post-Deploy:**
- [ ] Prueba completa de Lead Magnet en producción
- [ ] Prueba completa de Watchlist en producción
- [ ] Prueba completa de Beca en producción
- [ ] Prueba de compra con Stripe (modo test)

---

## 📝 **Notas Importantes**

### **Configuración de Apps Script:**
- El script está configurado en modo **LIVE** (producción)
- Stripe Secret Key es de producción
- Los Payment Links son reales

### **Limitaciones:**
- Google Apps Script tiene límites de cuotas diarias
- MailApp tiene límite de 100 emails/día (cuenta gratuita)
- Para mayor volumen, considerar usar SendGrid o similar

### **Seguridad:**
- Stripe Secret Key está en el código (Apps Script es privado)
- No hay claves expuestas en el frontend
- CORS manejado con iframe oculto

---

## 🎯 **Próximos Pasos Recomendados**

1. **Marketing:**
   - [ ] Configurar Google Analytics
   - [ ] Configurar Facebook Pixel
   - [ ] Configurar Meta Ads

2. **Optimización:**
   - [ ] Implementar lazy loading para imágenes
   - [ ] Optimizar video de hero section
   - [ ] Minificar CSS y JS

3. **SEO:**
   - [ ] Agregar meta tags
   - [ ] Configurar Open Graph
   - [ ] Crear sitemap.xml

4. **Funcionalidades futuras:**
   - [ ] Dashboard de administración
   - [ ] Sistema de notificaciones
   - [ ] Integración con CRM

---

## 👥 **Contacto**

- **Email:** Mtzstrategies@gmail.com
- **Instagram:** @CryptoCultura_io
- **Website:** (Por desplegar)

---

## 📄 **Licencia**

Proyecto privado - CRYPTOCULTURA © 2025

---

**Última actualización:** 2025-01-28
**Versión:** 1.0.0 (Ready for Deploy)
**Apps Script Version:** v14
