
const AVATAR_OPCIONES = ['🌿', '🌱', '🌻', '🌺', '🌸', '🌵', '🍃', '🌾'];

function ScreenPerfil({ onPlanta }) {
  const [pendDone, setPendDone] = React.useState({});
  const iconsMap = { IcSprout, IcRoot, IcLeaf, IcFlower, IcDrop };

  const [avatarEmoji, setAvatarEmoji] = React.useState(
    () => localStorage.getItem('tc_avatar_emoji') || '🌿'
  );
  const [showPicker, setShowPicker] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  const [nombre, setNombre] = React.useState(
    () => localStorage.getItem('tc_nombre_jardin') || 'Terraza Cádiz'
  );
  const [editandoNombre, setEditandoNombre] = React.useState(false);
  const [nombreTmp, setNombreTmp] = React.useState(nombre);

  const [ciudad, setCiudad] = React.useState(
    () => localStorage.getItem('tc_ciudad') || 'Cádiz, España'
  );
  const [ciudadTmp, setCiudadTmp] = React.useState(ciudad);
  const [nombreSheet, setNombreSheet] = React.useState(nombre);

  const [resetMsg, setResetMsg] = React.useState(false);
  const [exportMsg, setExportMsg] = React.useState(false);

  const toggle = (id) => setPendDone(prev => ({ ...prev, [id]: !prev[id] }));
  const pendientesRestantes = PENDIENTES.filter(p => !pendDone[p.id]).length;

  const seleccionarEmoji = (e) => {
    setAvatarEmoji(e);
    localStorage.setItem('tc_avatar_emoji', e);
    setShowPicker(false);
  };

  const guardarNombre = () => {
    const n = nombreTmp.trim() || 'Terraza Cádiz';
    setNombre(n);
    localStorage.setItem('tc_nombre_jardin', n);
    setEditandoNombre(false);
  };

  const guardarSettings = () => {
    const n = nombreSheet.trim() || 'Terraza Cádiz';
    const c = ciudadTmp.trim() || 'Cádiz, España';
    setNombre(n);
    setCiudad(c);
    localStorage.setItem('tc_nombre_jardin', n);
    localStorage.setItem('tc_ciudad', c);
    setShowSettings(false);
  };

  const resetearSiembras = () => {
    Object.keys(localStorage).filter(k => k.startsWith('tc_siembra_')).forEach(k => localStorage.removeItem(k));
    setResetMsg(true);
    setTimeout(() => setResetMsg(false), 2500);
  };

  const exportarDatos = () => {
    const data = {
      exportDate: new Date().toISOString(),
      jardin: {
        nombre: localStorage.getItem('tc_nombre_jardin') || 'Terraza Cádiz',
        ciudad: localStorage.getItem('tc_ciudad') || 'Cádiz, España',
      },
      plantas: PLANTAS.map(p => ({
        ...p,
        ultimoRiego: localStorage.getItem('tc_riego_' + p.id) || p.ultimoRiego,
      })),
      siembras: SIEMBRAS,
      pendientes: PENDIENTES,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantas-cadiz-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportMsg(true);
    setTimeout(() => setExportMsg(false), 2500);
  };

  const ajustes = [
    { label: 'Notificaciones de riego', detail: 'Activas', onClick: null },
    { label: 'Ubicación', detail: ciudad, onClick: () => { setNombreSheet(nombre); setCiudadTmp(ciudad); setShowSettings(true); } },
    { label: 'Exportar datos', detail: exportMsg ? '✅ Descargado' : null, onClick: exportarDatos },
    { label: 'Acerca de', detail: 'v1.0', onClick: null },
  ];

  return (
    <ScreenBg>
      <TopBar
        title="Perfil"
        trailing={
          <button
            onClick={() => { setNombreSheet(nombre); setCiudadTmp(ciudad); setShowSettings(true); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <IcSettings size={20} color={T.textoSub} />
          </button>
        }
      />

      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <button
              onClick={() => setShowPicker(v => !v)}
              style={{
                width: 80, height: 80, borderRadius: 40,
                background: T.verdeSoft, border: `3px solid ${showPicker ? T.verde : T.verdeLine}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              {avatarEmoji}
            </button>
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 22, height: 22, borderRadius: 11,
              background: T.verde, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid white', pointerEvents: 'none',
            }}>
              <IcPlus size={11} color="#fff" />
            </div>
          </div>

          {showPicker && (
            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
              background: T.card, borderRadius: 16, padding: '12px 16px',
              border: `1px solid ${T.border}`, marginBottom: 12,
              boxShadow: '0 4px 20px rgba(31,77,58,0.1)',
            }}>
              {AVATAR_OPCIONES.map(e => (
                <button
                  key={e}
                  onClick={() => seleccionarEmoji(e)}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    border: `2px solid ${e === avatarEmoji ? T.verde : T.border}`,
                    background: e === avatarEmoji ? T.verdeSoft : 'transparent',
                    fontSize: 22, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >{e}</button>
              ))}
            </div>
          )}

          {editandoNombre ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                autoFocus
                value={nombreTmp}
                onChange={e => setNombreTmp(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') guardarNombre(); if (e.key === 'Escape') setEditandoNombre(false); }}
                style={{
                  fontSize: 20, fontWeight: 700, color: T.texto,
                  border: `2px solid ${T.verde}`, borderRadius: 10,
                  padding: '4px 10px', fontFamily: T.font,
                  background: T.card, outline: 'none', textAlign: 'center',
                  letterSpacing: -0.3,
                }}
              />
              <button onClick={guardarNombre} style={{
                background: T.verde, border: 'none', borderRadius: 8,
                padding: '6px 10px', cursor: 'pointer',
              }}>
                <IcCheck size={14} color="#fff" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setNombreTmp(nombre); setEditandoNombre(true); }}
              style={{
                fontSize: 22, fontWeight: 700, color: T.texto, letterSpacing: -0.3,
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font,
                padding: '2px 6px', borderRadius: 8,
                borderBottom: `2px dashed ${T.verdeLine}`,
              }}
            >
              {nombre}
            </button>
          )}
          <div style={{ fontSize: 13, color: T.textoSub, marginTop: 3 }}>{ciudad}</div>
          {!editandoNombre && (
            <div style={{ fontSize: 11, color: T.textoSub, marginTop: 4 }}>Toca el nombre para editar · toca el emoji para cambiarlo</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {[
            { n: PLANTAS.length, label: 'PLANTAS', color: T.verde },
            { n: SIEMBRAS.length, label: 'SIEMBRAS', color: T.verdeClaro },
            { n: pendientesRestantes, label: 'PENDIENTES', color: T.naranja },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: T.card, borderRadius: 16, padding: '14px 10px',
              textAlign: 'center', border: `1px solid ${T.border}`,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.n}</div>
              <div style={{ fontSize: 10, color: T.textoSub, fontWeight: 600, letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Pendientes</SectionTitle>
          <Card>
            {PENDIENTES.map((p, i) => {
              const Icon = iconsMap[p.icono] || IcLeaf;
              const done = pendDone[p.id];
              return (
                <div key={p.id} onClick={() => toggle(p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderBottom: i < PENDIENTES.length - 1 ? `1px solid ${T.border}` : 'none',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 17,
                    background: done ? T.verdeSoft : '#F0F4F1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} color={done ? T.verde : T.textoSub} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: done ? T.textoSub : T.texto,
                      textDecoration: done ? 'line-through' : 'none',
                    }}>{p.texto}</div>
                    <div style={{ fontSize: 11, color: T.textoSub, marginTop: 1 }}>{p.nota}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: 11,
                    border: `2px solid ${done ? T.verde : T.border}`,
                    background: done ? T.verde : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {done && <IcCheck size={11} color="#fff" />}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Configuración</SectionTitle>
          <Card>
            {ajustes.map((a, i) => (
              <div
                key={a.label}
                onClick={a.onClick || undefined}
                style={{
                  display: 'flex', alignItems: 'center', padding: '14px 16px',
                  borderBottom: `1px solid ${T.border}`,
                  cursor: a.onClick ? 'pointer' : 'default',
                }}
              >
                <span style={{ flex: 1, fontSize: 14, color: a.onClick ? T.texto : T.textoSub }}>{a.label}</span>
                {a.detail && <span style={{ fontSize: 13, color: T.textoSub, marginRight: 8 }}>{a.detail}</span>}
                {a.onClick && <IcChevronRight size={14} color={T.border} />}
              </div>
            ))}
            <div style={{ padding: '14px 16px' }}>
              <button
                onClick={resetearSiembras}
                style={{
                  width: '100%', padding: '10px 0',
                  background: '#FFF5F5', border: `1px solid #FDDCDC`,
                  borderRadius: 12, cursor: 'pointer', fontFamily: T.font,
                  fontSize: 14, color: T.rojo, fontWeight: 500,
                  transition: 'opacity 0.2s',
                }}
              >
                {resetMsg ? '✅ Siembras restablecidas' : '🔄 Resetear siembras a valores por defecto'}
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Settings bottom sheet */}
      {showSettings && (
        <>
          <div
            onClick={() => setShowSettings(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 199 }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            maxWidth: 480, margin: '0 auto',
            zIndex: 200, background: T.card,
            borderRadius: '24px 24px 0 0',
            padding: '24px 20px 48px',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: T.texto }}>Configuración del jardín</span>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: T.textoSub, padding: 4 }}>✕</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textoSub, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' }}>Nombre del jardín</div>
              <input
                value={nombreSheet}
                onChange={e => setNombreSheet(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px',
                  border: `1.5px solid ${T.border}`, borderRadius: 14,
                  fontSize: 15, fontFamily: T.font, color: T.texto,
                  background: T.bg, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = T.verde}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textoSub, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' }}>Ciudad</div>
              <input
                value={ciudadTmp}
                onChange={e => setCiudadTmp(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px',
                  border: `1.5px solid ${T.border}`, borderRadius: 14,
                  fontSize: 15, fontFamily: T.font, color: T.texto,
                  background: T.bg, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = T.verde}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>

            <button
              onClick={guardarSettings}
              style={{
                width: '100%', padding: '14px 0',
                background: T.verde, border: 'none', borderRadius: 16,
                fontSize: 15, fontWeight: 600, color: '#fff',
                cursor: 'pointer', fontFamily: T.font, marginBottom: 12,
              }}
            >
              Guardar cambios
            </button>

            <button
              onClick={() => { resetearSiembras(); }}
              style={{
                width: '100%', padding: '12px 0',
                background: '#FFF5F5', border: `1px solid #FDDCDC`,
                borderRadius: 14, cursor: 'pointer', fontFamily: T.font,
                fontSize: 14, color: T.rojo, fontWeight: 500,
              }}
            >
              {resetMsg ? '✅ Siembras restablecidas' : '🔄 Resetear siembras'}
            </button>
          </div>
        </>
      )}
    </ScreenBg>
  );
}

Object.assign(window, { ScreenPerfil });
