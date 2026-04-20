
function ScreenPerfil({ onPlanta }) {
  const [pendDone, setPendDone] = React.useState({});
  const iconsMap = { IcSprout, IcRoot, IcLeaf, IcFlower, IcDrop };

  const toggle = (id) => setPendDone(prev => ({ ...prev, [id]: !prev[id] }));
  const pendientesRestantes = PENDIENTES.filter(p => !pendDone[p.id]).length;

  const ajustes = [
    { label: 'Notificaciones de riego', detail: 'Activas' },
    { label: 'Ubicación', detail: 'Cádiz, España' },
    { label: 'Exportar datos', detail: null },
    { label: 'Acerca de', detail: 'v1.0' },
  ];

  return (
    <ScreenBg>
      <TopBar
        title="Perfil"
        trailing={
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <IcSettings size={20} color={T.textoSub} />
          </button>
        }
      />

      <div style={{ padding: '24px 20px 0' }}>
        {/* Avatar + info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 40,
              background: T.verdeSoft, border: `3px solid ${T.verdeLine}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 700, color: T.verde,
            }}>C</div>
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 22, height: 22, borderRadius: 11,
              background: T.verde, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid white',
            }}>
              <IcPlus size={11} color="#fff" />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.texto, letterSpacing: -0.3 }}>Terraza Cádiz</div>
          <div style={{ fontSize: 13, color: T.textoSub, marginTop: 3 }}>Piso alto · NE 25° · sol 7–11h</div>
        </div>

        {/* Stats */}
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

        {/* Pendientes */}
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

        {/* Ajustes */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Ajustes</SectionTitle>
          <Card>
            {ajustes.map((a, i) => (
              <div key={a.label} style={{
                display: 'flex', alignItems: 'center', padding: '14px 16px',
                borderBottom: i < ajustes.length - 1 ? `1px solid ${T.border}` : 'none',
                cursor: 'pointer',
              }}>
                <span style={{ flex: 1, fontSize: 14, color: T.texto }}>{a.label}</span>
                {a.detail && <span style={{ fontSize: 13, color: T.textoSub, marginRight: 8 }}>{a.detail}</span>}
                <IcChevronRight size={14} color={T.border} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </ScreenBg>
  );
}

Object.assign(window, { ScreenPerfil });
