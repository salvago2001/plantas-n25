# Plantas N25 — Memoria del proyecto

> App PWA-style (HTML + React 18 UMD, sin build step) para gestionar las plantas de una terraza en Cádiz. Móvil-first, 480 px máx, diseño en verde/crema.

---

## Stack y arquitectura

- **HTML + React 18** vía UMD + Babel Standalone. Sin npm, sin Webpack.
- **Archivos JSX** cargados con `<script type="text/babel" src="...">`.
- Cada archivo exporta sus símbolos a `window` al final: `Object.assign(window, { ... })`.
- **Persistencia:** `localStorage`. Prefijo de claves: `tc_`.
- **Tipografía:** Helvetica stack.
- **Iconos:** SVG inline stroke, `currentColor`, en `src/icons.jsx`.

### Orden de carga en `index.html` (crítico)

```
icons → data → ui → screen-home → screen-detail → screen-riego →
screen-siembra → screen-mapa → screen-perfil → app
```

---

## Estructura de archivos

```
index.html               ← entry point
src/
├── icons.jsx            ← IcLeaf, IcDrop, IcSun, IcBell, IcSettings, IcCheck, ...
├── data.jsx             ← PLANTAS[], SIEMBRAS[], PENDIENTES[], MAPA_POS[]
├── ui.jsx               ← tokens T{}, ScreenBg, TopBar, BottomNav, Card, Badge, StatChip, DiagRow
├── screen-home.jsx      ← pantalla principal: grid/lista de plantas + alertas + panel campana
├── screen-detail.jsx    ← ficha de planta: stats, calendario riego, diagnóstico, notas
├── screen-riego.jsx     ← lista ordenada por urgencia + checkboxes persistentes
├── screen-siembra.jsx   ← diario de semillas con fases y progreso
├── screen-mapa.jsx      ← mapa esquemático con plantas posicionadas
├── screen-perfil.jsx    ← perfil + pendientes + configuración + exportar
└── app.jsx              ← router (useState screen/plantaId), BottomNav
```

---

## Tokens de diseño (`T` en ui.jsx)

```js
verde:'#1F4D3A'  verdeClaro:'#4A8C42'  verdeSoft:'#D9E8DC'  verdeLine:'#C7D9C9'
arena:'#F0E6D3'  crema:'#FAF6EF'  bg:'#F3F1ED'  card:'#FFFFFF'
texto:'#1A2E24'  textoSub:'#7A8A82'  border:'#ECE9E2'
naranja:'#C4622D'  rojo:'#C0392B'  azul:'#4A7C9E'
```

---

## Modelo de datos

```js
// PLANTAS[]: 9 plantas (ver data.jsx para lista completa)
{ id, img, emoji, nombre, tipo, familia,
  estado: 'bien'|'atencion'|'floreciendo'|'pendiente',
  riegoDias, ultimoRiego: 'YYYY-MM-DD',
  humedad, altura, diametro, temp, luz, ubicacion, plantada,
  diagnosis: [{ tipo, titulo, valor, nota, sev:'low'|'mid'|'high' }],
  notas }

// SIEMBRAS[]: 7 siembras (lavanda, tomate cherry, albahaca, ...)
{ id, img, emoji, nombre, latin, fecha, dias, diasGerminar, ubicacion,
  fase: 'germinando'|'plántula'|'trasplantado' }

// PENDIENTES[]: 5 tareas
{ id, icono: 'IcSprout'|'IcRoot'|'IcLeaf'|'IcFlower', texto, nota }

// MAPA_POS[]: posiciones % en el mapa esquemático
{ id, left: '72%', top: '60%' }
```

---

## localStorage — claves usadas

| Clave | Valor | Descripción |
|---|---|---|
| `tc_screen` | string screen id | pantalla activa al recargar |
| `tc_planta` | int id | última planta visitada |
| `tc_avatar_emoji` | emoji | emoji del avatar en Perfil |
| `tc_nombre_jardin` | string | nombre editable del jardín |
| `tc_ciudad` | string | ciudad editable (p.ej. "Cádiz, España") |
| `tc_riego_${id}` | `'YYYY-MM-DD'` | **fecha real del último riego** por planta; sobreescribe `ultimoRiego` del dataset |

> **Patrón crítico:** siempre leer riego con `localStorage.getItem('tc_riego_' + p.id) || p.ultimoRiego`. Nunca usar `p.ultimoRiego` directamente en cálculos de pantalla.

---

## Cálculo de riego

```js
// diasRiego — días hasta el próximo riego (negativo = vencido)
const ultimo = localStorage.getItem('tc_riego_' + p.id) || p.ultimoRiego;
const dias = p.riegoDias - Math.floor((new Date() - new Date(ultimo)) / 86400000);

// cicloProgress — % del ciclo transcurrido (0–100)
const diasDesde = Math.floor((new Date() - new Date(ultimo)) / 86400000);
const progress = Math.min(100, Math.round((diasDesde / p.riegoDias) * 100));

// isDone — regada hoy (para checkboxes en screen-riego)
const hoyStr = new Date().toISOString().split('T')[0];
const done = (localStorage.getItem('tc_riego_' + p.id) || p.ultimoRiego) === hoyStr;

// proximoFecha — fecha real legible
const d = new Date(); d.setDate(d.getDate() + Math.max(0, dias));
const fecha = d.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'short' });
// → "lunes 28 abr"
```

---

## Router (`app.jsx`)

```js
screen: 'home' | 'detail' | 'riego' | 'siembra' | 'mapa' | 'perfil'
plantaId: int
prevScreen: string  // para volver desde detail

nav(tab)      → goTo(tab)       // todos los tabs del BottomNav
openPlanta(id)→ setScreen('detail'), setPlantaId(id)
goBack()      → setScreen(prevScreen)
```

BottomNav tabs (de izquierda a derecha): **Plantas** (`home`) · **Riego** · **[FAB Siembra]** · **Mapa** · **Perfil**

---

## Funcionalidades implementadas (sesión 2026-04-22)

### screen-riego.jsx
- Estado `overrides` cargado desde localStorage al montar.
- `toggle(p)` persiste `tc_riego_${id} = hoyStr` en localStorage.
- Lista ordenada por urgencia; plantas regadas hoy bajan al final.
- Cada card muestra barra de progreso del ciclo + fecha real "Próximo riego: lunes 28 abr".
- El checkmark desmarca si vuelves a pulsarlo (elimina la key de localStorage).

### screen-detail.jsx
- Lee `ultimoRiego` desde localStorage antes de calcular `diasRestantes`.
- Calendario usa la fecha real de último riego (marca el día correcto).
- Sección "Próximo riego" muestra fecha real con día de la semana.
- Barra de progreso del ciclo con color semafórico (verde/naranja/rojo).

### screen-home.jsx
- `diasRiego(p)` usa localStorage (consistente con screen-riego).
- 🔔 **Campana:** abre panel (bottom sheet fixed) con plantas que requieren riego hoy o mañana. Badge rojo si hay alertas.
- ⚠️ **Alert bar "necesitan atención":** clicable. Activa `filtroAtencion` → lista solo muestra plantas con `estado === 'atencion'`. "Ver todas" lo desactiva.
- `modoLista = verTodas || filtroAtencion`.

### screen-perfil.jsx
- ⚙️ **Gear:** abre bottom sheet con inputs para nombre del jardín y ciudad, botón guardar y resetear siembras.
- **"Exportar datos":** descarga `plantas-cadiz-backup.json` con plantas (fechas riego actualizadas), siembras y pendientes.
- `tc_ciudad` persistido en localStorage; visible en subtítulo del perfil.

### screen-mapa.jsx
- `diasRiego(p)` usa localStorage para colores de dot (coherente con el resto).

---

## Patrones de componentes

```jsx
// Bottom sheet overlay (usado en home y perfil)
<>
  <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:199 }} />
  <div style={{ position:'fixed', bottom:0, left:0, right:0, maxWidth:480, margin:'0 auto', zIndex:200,
    background:T.card, borderRadius:'24px 24px 0 0', padding:'24px 20px 48px' }}>
    {/* contenido */}
  </div>
</>
// NOTA: position:fixed funciona correctamente aunque el contenedor app tenga overflow:hidden,
// porque el app div no tiene transform/filter (que crearían un nuevo containing block).
```

```jsx
// Exportar datos como JSON
const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'plantas-cadiz-backup.json';
document.body.appendChild(a); a.click();
document.body.removeChild(a); URL.revokeObjectURL(url);
```

---

## Normas de desarrollo

1. **Nunca** `const styles = {...}` en scope global — colisiona entre archivos. Usa inline styles.
2. **Siempre** `Object.assign(window, { ComponenteNuevo })` al final de cada archivo.
3. Si añades un archivo, inclúyelo en `index.html` **en el orden correcto** (tras sus dependencias).
4. Añadir plantas nuevas en `data.jsx` + imagen en `img/` + posición en `MAPA_POS`.
5. Al leer fechas de riego, **siempre** usar el patrón `localStorage.getItem('tc_riego_' + id) || p.ultimoRiego`.

---

## Repo

- **GitHub:** `salvago2001/plantas-n25`
- **Rama principal:** `main`
- **Deploy:** GitHub Pages (abrir `index.html` directamente o via Pages)
