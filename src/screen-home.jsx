
function ScreenHome({ onPlanta }) {
  const featured = PLANTAS[0];
  const hoy = new Date();
  const [verTodas, setVerTodas] = React.useState(false);
  const [filtroAtencion, setFiltroAtencion] = React.useState(false);
  const [showBell, setShowBell] = React.useState(false);
  const nombre = localStorage.getItem('tc_nombre_jardin') || 'Terraza Cádiz';

  const diasRiego = (p) => {
    const ultimo = localStorage.getItem('tc_riego_' + p.id) || p.ultimoRiego;
    return p.riegoDias - Math.floor((hoy - new Date(ultimo)) / 86400000);
  };

  const urgentes = PLANTAS.filter(p => diasRiego(p) <= 0).length;
  const atencion = PLANTAS.filter(p => p.estado === 'atencion').length;
  const plantasAlerta = PLANTAS.filter(p => diasRiego(p) <= 1);

  const plantasVista = filtroAtencion ? PLANTAS.filter(p => p.estado === 'atencion') : PLANTAS;
  const modoLista = verTodas || filtroAtencion;

  return (
    <ScreenBg>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 13, color: T.textoSub, marginBottom: 2 }}>Buenos días ☀️</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: T.texto, letterSpacing: -0.5 }}>{nombre}</div>
            <div style={{ fontSize: 12, color: T.textoSub, marginTop: 3 }}>
              Piso alto · NE 25° · sol 7–11h
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowBell(v => !v)}
              style={{
                width: 38, height: 38, borderRadius: 19,
                background: T.card, border: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
              }}
            >
              <IcBell size={18} color={plantasAlerta.length > 0 ? T.naranja : T.textoSub} />
              {plantasAlerta.length > 0 && (
                <div style={{
                  position: 'absolute', top: 7, right: 7,
                  width: 8, height: 8, borderRadius: 4, background: T.rojo,
                  border: '1.5px solid white',
                }} />
              )}
            </button>
          </div>
        </div>

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

      <div style={{ padding: '20px 20px 0' }}>
        <Card>
          <div style={{ display: 'flex', gap: 14, padding: 16, alignItems: 'flex-start' }}>
            <PlantImg
              src={featured.img}
              alt={featured.nombre}
              emoji={featured.emoji}
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

      {(urgentes > 0 || atencion > 0) && (
        <div style={{ margin: '16px 20px 0', display: 'flex', gap: 8 }}>
          {urgentes > 0 && (
            <div style={{
              flex: 1, background: '#FFF5F5', border: `1px solid #FDDCDC`,
              borderRadius: 14, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <IcDrop size={15} color={T.rojo} />
              <span style={{ fontSize: 12, color: T.rojo, fontWeight: 500 }}>
                {urgentes} sin riego
              </span>
            </div>
          )}
          {atencion > 0 && (
            <button
              onClick={() => setFiltroAtencion(v => !v)}
              style={{
                flex: 1, background: filtroAtencion ? '#FFE8CC' : '#FFF8F0',
                border: `1px solid ${filtroAtencion ? T.naranja : '#FDDCB5'}`,
                borderRadius: 14, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', fontFamily: T.font,
              }}
            >
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ fontSize: 12, color: T.naranja, fontWeight: 600 }}>
                {filtroAtencion ? `Mostrando ${plantasVista.length}` : `${atencion} necesitan atención`}
              </span>
            </button>
          )}
        </div>
      )}

      <div style={{ padding: '20px 20px 0' }}>
        <SectionTitle
          action={filtroAtencion ? 'Ver todas' : (verTodas ? 'Ver cuadrícula' : 'Ver todas')}
          onAction={() => {
            if (filtroAtencion) { setFiltroAtencion(false); return; }
            setVerTodas(v => !v);
          }}
        >
          {filtroAtencion ? `Atención (${plantasVista.length})` : 'Mis plantas'}
        </SectionTitle>

        {modoLista ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plantasVista.map(p => {
              const dias = diasRiego(p);
              return (
                <Card key={p.id} onClick={() => onPlanta(p.id)} style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <PlantImg
                      src={p.img} alt={p.nombre} emoji={p.emoji}
                      style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.texto }}>{p.nombre}</div>
                        <Badge kind={p.estado} />
                      </div>
                      <div style={{ fontSize: 11, color: T.textoSub, marginTop: 2 }}>{p.tipo} · {p.ubicacion}</div>
                      <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <IcDrop size={11} color={dias <= 0 ? T.rojo : dias <= 2 ? T.naranja : T.textoSub} />
                        <span style={{ fontSize: 11, color: dias <= 0 ? T.rojo : dias <= 2 ? T.naranja : T.textoSub, fontWeight: dias <= 2 ? 600 : 400 }}>
                          {dias <= 0 ? 'Riega hoy' : `Riego en ${dias}d`}
                        </span>
                        <span style={{ fontSize: 11, color: T.border }}>·</span>
                        <span style={{ fontSize: 11, color: T.textoSub }}>{p.altura}cm · Ø{p.diametro}cm</span>
                      </div>
                    </div>
                    <IcChevronRight size={14} color={T.border} />
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
                  <PlantImg src={p.img} alt={p.nombre} emoji={p.emoji}
                    style={{ width: '100%', height: 100, objectFit: 'cover' }}
                  />
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
        )}
      </div>

      {/* Bell notification panel */}
      {showBell && (
        <>
          <div
            onClick={() => setShowBell(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 199 }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            maxWidth: 480, margin: '0 auto',
            zIndex: 200, background: T.card,
            borderRadius: '24px 24px 0 0',
            padding: '20px 20px 48px',
            maxHeight: '65vh', overflowY: 'auto',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <IcBell size={20} color={T.naranja} />
              <span style={{ fontSize: 17, fontWeight: 700, color: T.texto }}>Alertas de riego</span>
            </div>
            {plantasAlerta.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: T.textoSub, fontSize: 14 }}>
                ✅ Todas las plantas están al día
              </div>
            ) : (
              plantasAlerta.map((p, i) => {
                const dias = diasRiego(p);
                return (
                  <div
                    key={p.id}
                    onClick={() => { setShowBell(false); onPlanta(p.id); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0', cursor: 'pointer',
                      borderBottom: i < plantasAlerta.length - 1 ? `1px solid ${T.border}` : 'none',
                    }}
                  >
                    <PlantImg src={p.img} alt={p.nombre} emoji={p.emoji}
                      style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: T.texto }}>{p.nombre}</div>
                      <div style={{ fontSize: 12, color: dias <= 0 ? T.rojo : T.naranja, fontWeight: 500, marginTop: 2 }}>
                        {dias <= 0 ? '💧 Riega hoy' : '💧 Riega mañana'}
                      </div>
                    </div>
                    <IcChevronRight size={14} color={T.border} />
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </ScreenBg>
  );
}

Object.assign(window, { ScreenHome });
