
function ScreenRiego({ onPlanta }) {
  const [done, setDone] = React.useState({});
  const hoy = new Date();

  const diasRiego = (p) => p.riegoDias - Math.floor((hoy - new Date(p.ultimoRiego)) / 86400000);

  const plantas = [...PLANTAS].sort((a, b) => diasRiego(a) - diasRiego(b));

  const urgency = (dias) => {
    if (dias <= 0) return { color: T.rojo, bg: '#FFF5F5', label: 'Urgente', dot: T.rojo };
    if (dias <= 2) return { color: T.naranja, bg: '#FFF8F0', label: `${dias}d`, dot: T.naranja };
    return { color: T.verdeClaro, bg: '#F4FAF0', label: `${dias}d`, dot: T.verdeClaro };
  };

  const toggle = (id) => setDone(prev => ({ ...prev, [id]: !prev[id] }));

  const regadasHoy = Object.values(done).filter(Boolean).length;

  return (
    <ScreenBg>
      <TopBar
        title="Riego"
        subtitle={`${regadasHoy} de ${plantas.length} regadas hoy`}
        trailing={
          <div style={{ fontSize: 13, color: T.verde, fontWeight: 600 }}>
            {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </div>
        }
      />

      <div style={{ padding: '16px 20px 0' }}>
        {/* Progress bar */}
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
            {regadasHoy === plantas.length ? '¡Todo regado! 🎉' : `Faltan ${plantas.length - regadasHoy}`}
          </div>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {plantas.map(p => {
            const dias = diasRiego(p);
            const u = urgency(dias);
            const isDone = done[p.id];

            return (
              <Card key={p.id} style={{ background: isDone ? '#F8FBF8' : T.card }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 12 }}>
                  {/* Urgency indicator */}
                  <div style={{
                    width: 4, height: 52, borderRadius: 2,
                    background: isDone ? T.border : u.dot, flexShrink: 0,
                  }} />

                  {/* Image */}
                  <img
                    src={p.img} alt={p.nombre}
                    onClick={() => onPlanta(p.id)}
                    style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0, cursor: 'pointer', opacity: isDone ? 0.5 : 1 }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => onPlanta(p.id)}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isDone ? T.textoSub : T.texto, textDecoration: isDone ? 'line-through' : 'none' }}>{p.nombre}</div>
                    <div style={{ fontSize: 11, color: T.textoSub, marginTop: 1 }}>{p.tipo} · {p.ubicacion}</div>
                    <div style={{ marginTop: 4 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: isDone ? T.textoSub : u.color,
                        background: isDone ? T.border : u.bg,
                        padding: '2px 7px', borderRadius: 8,
                      }}>
                        {isDone ? '✓ Regada' : (dias <= 0 ? '¡Hoy!' : `En ${dias}d`)}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <button onClick={() => toggle(p.id)} style={{
                    width: 30, height: 30, borderRadius: 15,
                    border: `2px solid ${isDone ? T.verde : T.border}`,
                    background: isDone ? T.verde : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
                  }}>
                    {isDone && <IcCheck size={14} color="#fff" />}
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
