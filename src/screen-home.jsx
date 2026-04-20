
function ScreenHome({ onPlanta }) {
  const featured = PLANTAS[0];
  const hoy = new Date();

  const diasRiego = (p) => p.riegoDias - Math.floor((hoy - new Date(p.ultimoRiego)) / 86400000);
  const urgentes = PLANTAS.filter(p => diasRiego(p) <= 0).length;
  const atencion = PLANTAS.filter(p => p.estado === 'atencion').length;

  return (
    <ScreenBg>
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 13, color: T.textoSub, marginBottom: 2 }}>Buenos días —</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: T.texto, letterSpacing: -0.5 }}>Terraza Cádiz</div>
            <div style={{ fontSize: 12, color: T.textoSub, marginTop: 3 }}>
              Piso alto · NE 25° · sol 7–11h
            </div>
          </div>
          <button style={{
            width: 38, height: 38, borderRadius: 19,
            background: T.card, border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <IcBell size={18} color={T.textoSub} />
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {[
            { n: PLANTAS.length, label: 'PLANTAS', color: T.verde },
            { n: SIEMBRAS.length, label: 'SIEMBRAS', color: T.verdeClaro },
            { n: PENDIENTES.length, label: 'PENDIENTES', color: T.naranja },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: T.card, borderRadius: 16, padding: '12px 10px',
              textAlign: 'center', border: `1px solid ${T.border}`,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.n}</div>
              <div style={{ fontSize: 10, color: T.textoSub, fontWeight: 600, letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnosis banner */}
      <div style={{ padding: '20px 20px 0' }}>
        <Card>
          <div style={{ display: 'flex', gap: 14, padding: 16, alignItems: 'flex-start' }}>
            <img
              src={featured.img}
              alt={featured.nombre}
              style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.texto }}>{featured.nombre}</div>
                  <div style={{ fontSize: 11, color: T.textoSub }}>{featured.familia}</div>
                </div>
                <Badge kind={featured.estado} />
              </div>
              {featured.diagnosis.map((d, i) => <DiagRow key={i} item={d} />)}
            </div>
          </div>
        </Card>
      </div>

      {/* Alert bar */}
      {(urgentes > 0 || atencion > 0) && (
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{
            background: '#FFF8F0', border: `1px solid #FDDCB5`,
            borderRadius: 14, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <IcDrop size={16} color={T.naranja} />
            <span style={{ fontSize: 13, color: T.naranja, fontWeight: 500 }}>
              {urgentes > 0 && `${urgentes} planta${urgentes > 1 ? 's' : ''} sin riego`}
              {urgentes > 0 && atencion > 0 && ' · '}
              {atencion > 0 && `${atencion} necesitan atención`}
            </span>
          </div>
        </div>
      )}

      {/* Mis plantas grid */}
      <div style={{ padding: '20px 20px 0' }}>
        <SectionTitle action="Ver todas">Mis plantas</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Add new */}
          <Card style={{ minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, border: `2px dashed ${T.verdeLine}`, boxShadow: 'none', background: T.crema }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: T.verdeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcPlus size={18} color={T.verde} />
            </div>
            <span style={{ fontSize: 12, color: T.textoSub, fontWeight: 500 }}>Añadir planta</span>
          </Card>

          {PLANTAS.map(p => {
            const dias = diasRiego(p);
            return (
              <Card key={p.id} onClick={() => onPlanta(p.id)} style={{ minHeight: 140, position: 'relative' }}>
                <img src={p.img} alt={p.nombre} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                {p.estado === 'floreciendo' && (
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <IcFlower size={16} color="#E91E8A" />
                  </div>
                )}
                {p.estado === 'atencion' && (
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <span style={{ fontSize: 14 }}>⚠️</span>
                  </div>
                )}
                <div style={{ padding: '8px 10px 10px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.texto, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</div>
                  <div style={{ fontSize: 11, color: T.textoSub }}>{p.tipo}</div>
                  {dias <= 2 && (
                    <div style={{ marginTop: 4, fontSize: 10, color: dias <= 0 ? T.rojo : T.naranja, fontWeight: 600 }}>
                      {dias <= 0 ? '💧 Riega hoy' : `💧 ${dias}d`}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ScreenBg>
  );
}

Object.assign(window, { ScreenHome });
