
function ScreenSiembra() {
  const faseMap = {
    germinando:   { label: 'Germinando',   color: '#C4622D', bg: '#FFF3E0' },
    plántula:     { label: 'Plántula',     color: T.verdeClaro, bg: '#E8F5E2' },
    trasplantado: { label: 'Trasplantado', color: T.verde, bg: T.verdeSoft },
  };

  return (
    <ScreenBg>
      <TopBar title="Siembras" subtitle={`${SIEMBRAS.length} en seguimiento`} />

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {SIEMBRAS.map(s => {
          const fase = faseMap[s.fase] || faseMap.germinando;
          const progreso = Math.min(100, Math.round((s.dias / (s.diasGerminar * 3)) * 100));
          const germinado = s.dias >= s.diasGerminar;

          return (
            <Card key={s.id} style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <PlantImg src={s.img} alt={s.nombre} emoji={s.emoji}
                  style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: T.texto }}>{s.nombre}</div>
                      <div style={{ fontSize: 11, color: T.textoSub, fontStyle: 'italic', marginTop: 1 }}>{s.latin}</div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                      background: fase.bg, color: fase.color,
                    }}>{fase.label}</span>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: T.textoSub }}>Día {s.dias}</span>
                      <span style={{ fontSize: 12, color: germinado ? T.verdeClaro : T.textoSub, fontWeight: germinado ? 600 : 400 }}>
                        {germinado ? '✅ Germinada' : `Germina en ${s.diasGerminar - s.dias}d`}
                      </span>
                    </div>

                    <div style={{ height: 6, background: T.border, borderRadius: 3, position: 'relative' }}>
                      <div style={{
                        height: '100%', width: `${progreso}%`,
                        background: `linear-gradient(to right, ${T.verdeClaro}, ${T.verde})`,
                        borderRadius: 3, transition: 'width 0.5s ease',
                      }} />
                      <div style={{
                        position: 'absolute', top: -3, left: `${Math.min(100, Math.round((s.diasGerminar / (s.diasGerminar * 3)) * 100))}%`,
                        width: 2, height: 12, background: T.naranja, borderRadius: 1,
                        transform: 'translateX(-50%)',
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: T.textoSub }}>{s.ubicacion}</span>
                      <span style={{ fontSize: 10, color: T.textoSub }}>
                        Sembrada {new Date(s.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase milestones */}
              <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
                {['Siembra', 'Germinación', 'Plántula', 'Trasplante'].map((milestone, i) => {
                  const thresholds = [0, s.diasGerminar, s.diasGerminar * 1.5, s.diasGerminar * 3];
                  const reached = s.dias >= thresholds[i];
                  return (
                    <div key={milestone} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 10, margin: '0 auto 4px',
                        background: reached ? T.verde : T.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {reached && <IcCheck size={10} color="#fff" />}
                      </div>
                      <div style={{ fontSize: 9, color: reached ? T.verde : T.textoSub, fontWeight: reached ? 600 : 400 }}>
                        {milestone}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}

        {/* Add seed CTA */}
        <button style={{
          width: '100%', padding: '14px 0',
          border: `2px dashed ${T.verdeLine}`,
          borderRadius: 20, background: T.crema,
          cursor: 'pointer', fontFamily: T.font,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <IcPlus size={16} color={T.verde} />
          <span style={{ fontSize: 14, color: T.verde, fontWeight: 500 }}>Nueva siembra</span>
        </button>
      </div>
    </ScreenBg>
  );
}

Object.assign(window, { ScreenSiembra });
