
function ScreenRiego({ onPlanta }) {
  const hoy = new Date();
  const hoyStr = hoy.toISOString().split('T')[0];

  const [overrides, setOverrides] = React.useState(() => {
    const o = {};
    PLANTAS.forEach(p => {
      const s = localStorage.getItem('tc_riego_' + p.id);
      if (s) o[p.id] = s;
    });
    return o;
  });

  const lastRiego = (p) => overrides[p.id] || p.ultimoRiego;
  const isDone = (p) => lastRiego(p) === hoyStr;
  const diasRiego = (p) => p.riegoDias - Math.floor((hoy - new Date(lastRiego(p))) / 86400000);
  const cicloProgress = (p) => {
    const diasDesde = Math.floor((hoy - new Date(lastRiego(p))) / 86400000);
    return Math.min(100, Math.round((diasDesde / p.riegoDias) * 100));
  };
  const proximoFecha = (p) => {
    const dias = diasRiego(p);
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + Math.max(0, dias));
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const toggle = (p) => {
    if (!isDone(p)) {
      localStorage.setItem('tc_riego_' + p.id, hoyStr);
      setOverrides(prev => ({ ...prev, [p.id]: hoyStr }));
    } else {
      localStorage.removeItem('tc_riego_' + p.id);
      setOverrides(prev => { const n = { ...prev }; delete n[p.id]; return n; });
    }
  };

  const plantas = [...PLANTAS].sort((a, b) => diasRiego(a) - diasRiego(b));
  const regadasHoy = plantas.filter(p => isDone(p)).length;

  const urgency = (dias) => {
    if (dias <= 0) return { color: T.rojo, bg: '#FFF5F5', dot: T.rojo };
    if (dias <= 2) return { color: T.naranja, bg: '#FFF8F0', dot: T.naranja };
    return { color: T.verdeClaro, bg: '#F4FAF0', dot: T.verdeClaro };
  };

  return (
    <ScreenBg>
      <TopBar
        title="Riego"
        subtitle={`${regadasHoy} de ${plantas.length} regadas hoy`}
        trailing={
          <div style={{ fontSize: 13, color: T.verde, fontWeight: 600 }}>
            {hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </div>
        }
      />

      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ height: 6, background: T.border, borderRadius: 3 }}>
            <div style={{
              height: '100%',
              width: `${(regadasHoy / plantas.length) * 100}%`,
              background: T.verde, borderRadius: 3,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <div style={{ marginTop: 5, fontSize: 11, color: T.textoSub }}>
            {regadasHoy === plantas.length ? '✅ ¡Todo regado!' : `Faltan ${plantas.length - regadasHoy}`}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {plantas.map(p => {
            const dias = diasRiego(p);
            const u = urgency(dias);
            const done = isDone(p);
            const progress = cicloProgress(p);

            return (
              <Card key={p.id} style={{ background: done ? '#F8FBF8' : T.card }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 12 }}>
                  <div style={{
                    width: 4, borderRadius: 2, alignSelf: 'stretch',
                    background: done ? T.border : u.dot, flexShrink: 0,
                  }} />

                  <PlantImg
                    src={p.img} alt={p.nombre} emoji={p.emoji}
                    onClick={() => onPlanta(p.id)}
                    style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0, cursor: 'pointer', opacity: done ? 0.5 : 1 }}
                  />

                  <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => onPlanta(p.id)}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: done ? T.textoSub : T.texto, textDecoration: done ? 'line-through' : 'none' }}>
                      {p.nombre}
                    </div>
                    <div style={{ fontSize: 11, color: T.textoSub, marginTop: 1 }}>{p.tipo} · {p.ubicacion}</div>

                    {done ? (
                      <div style={{ marginTop: 5 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.verde, background: T.verdeSoft, padding: '2px 8px', borderRadius: 8 }}>
                          ✅ Regada hoy
                        </span>
                        <div style={{ fontSize: 10, color: T.textoSub, marginTop: 3 }}>
                          Próximo riego: {proximoFecha(p)}
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 5 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: u.color, background: u.bg,
                          padding: '2px 8px', borderRadius: 8,
                        }}>
                          {dias <= 0 ? '💧 ¡Hoy!' : `En ${dias}d`}
                        </span>
                        <div style={{ marginTop: 6 }}>
                          <div style={{ height: 3, background: T.border, borderRadius: 2, marginBottom: 3 }}>
                            <div style={{
                              height: '100%', width: `${progress}%`,
                              background: dias <= 0 ? T.rojo : dias <= 2 ? T.naranja : T.verdeClaro,
                              borderRadius: 2, transition: 'width 0.3s',
                            }} />
                          </div>
                          <div style={{ fontSize: 10, color: T.textoSub }}>
                            Próximo riego: {proximoFecha(p)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(p); }}
                    style={{
                      width: 38, height: 38, borderRadius: 19,
                      border: `2px solid ${done ? T.verde : T.border}`,
                      background: done ? T.verde : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', padding: 0,
                    }}
                  >
                    {done
                      ? <IcCheck size={16} color="#fff" />
                      : <span style={{ fontSize: 16, color: T.textoSub, lineHeight: 1 }}>✓</span>
                    }
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ScreenBg>
  );
}

Object.assign(window, { ScreenRiego });
