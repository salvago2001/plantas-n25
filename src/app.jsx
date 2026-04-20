
function App() {
  const [screen, setScreen] = React.useState(
    () => localStorage.getItem('tc_screen') || 'home'
  );
  const [plantaId, setPlantaId] = React.useState(
    () => parseInt(localStorage.getItem('tc_planta') || '1', 10)
  );
  const [prevScreen, setPrevScreen] = React.useState('home');

  React.useEffect(() => { localStorage.setItem('tc_screen', screen); }, [screen]);
  React.useEffect(() => { localStorage.setItem('tc_planta', plantaId); }, [plantaId]);

  const goTo = (s) => {
    setPrevScreen(screen);
    setScreen(s);
  };

  const openPlanta = (id) => {
    setPlantaId(id);
    setPrevScreen(screen);
    setScreen('detail');
  };

  const goBack = () => setScreen(prevScreen || 'home');

  const nav = (tab) => {
    if (tab === 'siembra') { goTo('siembra'); return; }
    goTo(tab);
  };

  const showNav = screen !== 'detail';

  let content;
  switch (screen) {
    case 'home':    content = <ScreenHome onPlanta={openPlanta} />; break;
    case 'detail':  content = <ScreenDetail plantaId={plantaId} onBack={goBack} />; break;
    case 'riego':   content = <ScreenRiego onPlanta={openPlanta} />; break;
    case 'siembra': content = <ScreenSiembra />; break;
    case 'mapa':    content = <ScreenMapa onPlanta={openPlanta} />; break;
    case 'perfil':  content = <ScreenPerfil onPlanta={openPlanta} />; break;
    default:        content = <ScreenHome onPlanta={openPlanta} />;
  }

  return (
    <div style={{
      width: '100%',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: '#F3F1ED',
      overflow: 'hidden',
      maxWidth: 480,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Scroll area */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
        {content}
      </div>

      {/* Bottom Nav */}
      {showNav && <BottomNav screen={screen} onNav={nav} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
