
function ScreenDetail({ plantaId, onBack }) {
  const planta = PLANTAS.find(p => p.id === plantaId) || PLANTAS[0];
  const hoy = new Date();
  const ultimoRiego = localStorage.getItem('tc_riego_' + planta.id) || planta.ultimoRiego;
  const diasRestantes = planta.riegoDias - Math.floor((hoy - new Date(ultimoRiego)) / 86400000);

  const proximoFecha = () => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + Math.max(0, diasRestantes));
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const cicloProgress = () => {
    const diasDesde = Math.floor((hoy - new Date(ultimoRiego)) / 86400000);
    return Math.min(100, Math.round((diasDesde / planta.riegoDias) * 100));
  };

  const chips = [
    { icon: IcDrop,        value: `${planta.humedad}%`, label: 'Humedad' },
    { icon: IcSun,         value: `${planta.luz}%`,     label: 'Luz' },
    { icon: IcThermometer, value: `${planta.temp}°C`,   label: 'Temp' },
    { icon: IcRuler,       value: `${planta.altura}cm`, label: 'Alto' },
  ];

  const calDays = [];
  for (let i = -6; i <= 6; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    const diffFromLastWatering = Math.floor((d - new Date(ultimoRiego)) / 86400000);
    const isWatered = diffFromLastWatering === 0;
    const isNext = Math.round((d - hoy) / 86400000) === diasRestantes;
    calDays.push({ date: d, isWatered, isNext, isToday: i === 0 });
  }

  const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const progColor = diasRestantes <= 0 ? T.rojo : diasRestantes <= 2 ? T.naranja : T.verde;

  return (
    <ScreenBg>
      <div style={{ position: 'relative', height: 240 }}>
        <PlantImg
          src={planta.img} alt={planta.nombre} emoji={planta.emoji}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }} />
        <button onClick={onBack} style={{
          position: 'absolute', top: 16, left: 16,
          width: 38, height: 38, borderRadius: 19,
          background: 'rgba(255,255,255,0.9)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IcChevronLeft size={18} color={T.texto} />
        </button>
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <Badge kind={planta.estado} />
        </div>
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -0.4, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>{planta.nombre}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{planta.familia} · {planta.ubicacion}</div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {chips.map((c, i) => <StatChip key={i} icon={c.icon} value={c.value} label={c.label} />)}
        </div>

        <Card style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.texto }}>Calendario de riego</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: progColor }}>
              {diasRestantes <= 0 ? '💧 ¡Riega hoy!' : `En ${diasRestantes}d`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
            {calDays.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, color: T.textoSub, fontWeight: 500 }}>{dayNames[d.date.getDay()]}</span>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: d.isWatered ? T.azul : d.isNext ? T.verdeSoft : d.isToday ? T.verdeLine : 'transparent',
                  border: d.isToday && !d.isWatered ? `2px solid ${T.verde}` : 'none',
                }}>
                  {d.isWatered ? (
                    <IcDrop size={12} color="#fff" />
                  ) : (
                    <span style={{ fontSize: 11, color: d.isToday ? T.verde : T.textoSub, fontWeight: d.isToday ? 700 : 400 }}>
                      {d.date.getDate()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: T.textoSub, fontWeight: 500 }}>
                Próximo riego: <span style={{ color: progColor, fontWeight: 700 }}>{diasRestantes <= 0 ? 'hoy' : proximoFecha()}</span>
              </span>
              <span style={{ fontSize: 11, color: T.textoSub }}>{cicloProgress()}%</span>
            </div>
            <div style={{ height: 5, background: T.border, borderRadius: 3 }}>
              <div style={{
                height: '100%', width: `${cicloProgress()}%`,
                background: progColor, borderRadius: 3,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: T.azul }} />
              <span style={{ fontSize: 11, color: T.textoSub }}>Regada</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: T.verdeSoft, border: `1px solid ${T.verdeLine}` }} />
              <span style={{ fontSize: 11, color: T.textoSub }}>Próximo riego</span>
            </div>
          </div>
        </Card>

        <Card style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.texto, marginBottom: 12 }}>Diagnóstico</div>
          {planta.diagnosis.map((d, i) => <DiagRow key={i} item={d} />)}
        </Card>

        {planta.notas && (
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.texto, marginBottom: 8 }}>Notas</div>
            <p style={{ fontSize: 13, color: T.textoSub, lineHeight: 1.6, margin: 0 }}>{planta.notas}</p>
          </Card>
        )}
      </div>
    </ScreenBg>
  );
}

Object.assign(window, { ScreenDetail });
