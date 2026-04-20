
const T = {
  verde: '#1F4D3A',
  verdeClaro: '#4A8C42',
  verdeSoft: '#D9E8DC',
  verdeLine: '#C7D9C9',
  arena: '#F0E6D3',
  crema: '#FAF6EF',
  bg: '#F3F1ED',
  card: '#FFFFFF',
  texto: '#1A2E24',
  textoSub: '#7A8A82',
  border: '#ECE9E2',
  naranja: '#C4622D',
  rojo: '#C0392B',
  azul: '#4A7C9E',
  font: "Helvetica, 'Helvetica Neue', Arial, sans-serif",
};

function ScreenBg({ children, style = {} }) {
  return (
    <div style={{
      minHeight: '100%',
      background: T.bg,
      paddingBottom: 24,
      fontFamily: T.font,
      ...style,
    }}>
      {children}
    </div>
  );
}

function TopBar({ title, onBack, trailing, subtitle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '16px 16px 12px',
      background: T.bg,
      position: 'sticky', top: 0, zIndex: 10,
      borderBottom: `1px solid ${T.border}`,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18,
          border: `1px solid ${T.border}`,
          background: T.card,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', marginRight: 12, flexShrink: 0,
          padding: 0,
        }}>
          <IcChevronLeft size={18} color={T.texto} />
        </button>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: T.texto, letterSpacing: -0.3 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: T.textoSub, marginTop: 1 }}>{subtitle}</div>}
      </div>
      {trailing && <div style={{ flexShrink: 0 }}>{trailing}</div>}
    </div>
  );
}

function BottomNav({ screen, onNav }) {
  const tabs = [
    { id: 'home', label: 'Plantas', icon: IcHome },
    { id: 'riego', label: 'Riego', icon: IcDrop },
    { id: 'mapa', label: 'Mapa', icon: IcMap },
    { id: 'perfil', label: 'Perfil', icon: IcUser },
  ];

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: T.card,
      borderTop: `1px solid ${T.border}`,
      padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
      position: 'relative',
    }}>
      {tabs.map((tab, i) => {
        if (i === 2) {
          return (
            <React.Fragment key="fab-group">
              {/* FAB triangular → siembra */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button onClick={() => onNav('siembra')} style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  filter: 'drop-shadow(0 6px 14px rgba(31,77,58,0.35))',
                  marginTop: -18,
                }}>
                  <svg width="58" height="58" viewBox="0 0 70 70" fill="none">
                    <path d="M35 5 L65 5 Q70 5 67 9 L40 58 Q35 65 30 58 L3 9 Q0 5 5 5 Z" fill={T.verde}/>
                    <line x1="35" y1="24" x2="35" y2="42" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="26" y1="33" x2="44" y2="33" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <NavTab tab={tab} active={screen === tab.id} onNav={onNav} />
            </React.Fragment>
          );
        }
        return <NavTab key={tab.id} tab={tab} active={screen === tab.id} onNav={onNav} />;
      })}
    </div>
  );
}

function NavTab({ tab, active, onNav }) {
  const Icon = tab.icon;
  return (
    <button onClick={() => onNav(tab.id)} style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 3, padding: '4px 0',
      background: 'none', border: 'none', cursor: 'pointer',
    }}>
      <Icon size={22} color={active ? T.verde : T.textoSub} />
      <span style={{
        fontSize: 10, fontFamily: T.font,
        color: active ? T.verde : T.textoSub,
        fontWeight: active ? 600 : 400,
      }}>{tab.label}</span>
    </button>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: T.card,
      borderRadius: 20,
      boxShadow: '0 1px 2px rgba(31,77,58,0.04), 0 4px 20px rgba(31,77,58,0.03)',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Badge({ kind }) {
  const map = {
    bien:        { label: 'Bien',        bg: '#E8F5E2', color: '#3A7A30' },
    atencion:    { label: 'Atención',    bg: '#FFF3E0', color: '#C4622D' },
    floreciendo: { label: 'Floreciendo', bg: '#FCE4EC', color: '#C0457A' },
    pendiente:   { label: 'Pendiente',   bg: '#EEF0FF', color: '#4A5FC4' },
    semilla:     { label: 'Semilla',     bg: T.verdeSoft, color: T.verde },
  };
  const s = map[kind] || map.bien;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 9px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color,
      letterSpacing: 0.2,
    }}>{s.label}</span>
  );
}

function StatChip({ icon: Icon, value, label, color = T.verde }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: T.verdeSoft, borderRadius: 14,
      padding: '10px 8px', minWidth: 64, gap: 3,
    }}>
      <Icon size={18} color={color} />
      <span style={{ fontSize: 14, fontWeight: 700, color: T.texto }}>{value}</span>
      <span style={{ fontSize: 10, color: T.textoSub, textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
    </div>
  );
}

function DiagRow({ item }) {
  const sevColor = { low: T.verdeClaro, mid: T.naranja, high: T.rojo };
  const color = sevColor[item.sev] || T.verdeClaro;
  return (
    <div style={{ padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: T.texto, fontWeight: 500 }}>{item.titulo}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{item.valor}%</span>
      </div>
      <div style={{ height: 5, background: T.border, borderRadius: 3, marginBottom: 4 }}>
        <div style={{ height: '100%', width: `${item.valor}%`, background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: T.textoSub }}>{item.nota}</span>
    </div>
  );
}

function SectionTitle({ children, action, onAction }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <span style={{ fontSize: 17, fontWeight: 700, color: T.texto }}>{children}</span>
      {action && (
        <button onClick={onAction} style={{
          fontSize: 13, color: T.verdeClaro, background: 'none', border: 'none',
          cursor: 'pointer', fontFamily: T.font, padding: 0,
        }}>{action}</button>
      )}
    </div>
  );
}

Object.assign(window, { T, ScreenBg, TopBar, BottomNav, Card, Badge, StatChip, DiagRow, SectionTitle });
