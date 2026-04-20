
function ScreenMapa({ onPlanta }) {
  const [selected, setSelected] = React.useState(null);
  const hoy = new Date();
  const diasRiego = (p) => p.riegoDias - Math.floor((hoy - new Date(p.ultimoRiego)) / 86400000);

  const dotColor = (p) => {
    if (p.estado === 'floreciendo') return '#E91E8A';
    const dias = diasRiego(p);
    if (dias <= 0) return T.rojo;
    if (dias <= 2) return T.naranja;
    return T.verde;
  };

  const selectedPlanta = selected ? PLANTAS.find(p => p.id === selected) : null;

  return (
    <ScreenBg>
      <TopBar title="Mapa de terraza" subtitle="Toca una planta para ver info" />

      <div style={{ padding: '16px 20px 0' }}>
        {/* Map area */}
        <Card style={{ position: 'relative', overflow: 'visible' }}>
          <div style={{
            width: '100%', paddingBottom: '70%',
            position: 'relative', overflow: 'hidden',
            borderRadius: 20,
            background: `linear-gradient(135deg, #E8F0E4 0%, #D5E8D0 40%, #C8DFC3 100%)`,
          }}>
            <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: T.textoSub, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>↑ Norte · Sur ↓</div>

            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={T.verde} strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <div style={{ position: 'absolute', top: '8%', left: '5%', width: '25%', height: '35%', background: 'rgba(31,77,58,0.08)', borderRadius: 10, border: `1px dashed ${T.verdeLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, color: T.verde, fontWeight: 600 }}>NORTE</span>
            </div>
            <div style={{ position: 'absolute', bottom: '8%', right: '5%', width: '35%', height: '40%', background: 'rgba(31,77,58,0.08)', borderRadius: 10, border: `1px dashed ${T.verdeLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, color: T.verde, fontWeight: 600 }}>SUR</span>
            </div>

            {MAPA_POS.map(pos => {
              const planta = PLANTAS.find(p => p.id === pos.id);
              if (!planta) return null;
              const color = dotColor(planta);
              const isSelected = selected === pos.id;

              return (
                <button
                  key={pos.id}
                  onClick={() => setSelected(isSelected ? null : pos.id)}
                  style={{
                    position: 'absolute',
                    left: pos.left, top: pos.top,
                    transform: 'translate(-50%, -50%)',
                    width: isSelected ? 44 : 36, height: isSelected ? 44 : 36,
                    borderRadius: '50%',
                    background: T.card,
                    border: `3px solid ${color}`,
                    boxShadow: isSelected ? `0 0 0 4px ${color}40` : '0 2px 8px rgba(0,0,0,0.15)',
                    cursor: 'pointer', padding: 2,
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                    zIndex: isSelected ? 10 : 1,
                  }}
                >
                  <PlantImg src={planta.img} alt={planta.nombre} emoji={planta.emoji}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </button>
              );
            })}
          </div>
        </Card>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 14, marginTop: 12, padding: '0 4px' }}>
          {[
            { color: T.verde, label: 'OK' },
            { color: T.naranja, label: 'Riego pronto' },
            { color: T.rojo, label: 'Urgente' },
            { color: '#E91E8A', label: 'Floreciendo' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: l.color }} />
              <span style={{ fontSize: 11, color: T.textoSub }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Selected plant info */}
        {selectedPlanta && (
          <Card style={{ marginTop: 16, padding: 14 }} onClick={() => onPlanta(selectedPlanta.id)}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <PlantImg src={selectedPlanta.img} alt={selectedPlanta.nombre} emoji={selectedPlanta.emoji}
                style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.texto }}>{selectedPlanta.nombre}</div>
                  <Badge kind={selectedPlanta.estado} />
                </div>
                <div style={{ fontSize: 12, color: T.textoSub, marginTop: 2 }}>{selectedPlanta.ubicacion} · {selectedPlanta.tipo}</div>
                <div style={{ fontSize: 12, color: T.verde, marginTop: 6, fontWeight: 500 }}>Ver ficha completa →</div>
              </div>
            </div>
          </Card>
        )}

        {/* All plants list */}
        {!selectedPlanta && (
          <div style={{ marginTop: 16 }}>
            <SectionTitle>Todas las plantas</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PLANTAS.map(p => (
                <Card key={p.id} onClick={() => onPlanta(p.id)} style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: dotColor(p), flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.texto }}>{p.nombre}</span>
                    <span style={{ fontSize: 11, color: T.textoSub }}>{p.ubicacion}</span>
                    <IcChevronRight size={14} color={T.border} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScreenBg>
  );
}

Object.assign(window, { ScreenMapa });
