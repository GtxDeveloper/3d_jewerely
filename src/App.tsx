import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import RingViewer from './components/RingViewer';
import DebugScene from './components/DebugScene';

function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const btn = (_label: string, to: string) => ({
    onClick: () => navigate(to),
    style: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '14px',
      fontFamily: 'inherit',
      background: pathname === to ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
      color: pathname === to ? '#111' : '#fff',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,
  });

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 100,
      display: 'flex',
      gap: '8px',
      background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(12px)',
      padding: '8px',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <button {...btn('💍 Ring Viewer', '/')}>💍 Ring Viewer</button>
      <button {...btn('🧪 Debug Lab', '/debug')}>🧪 Debug Lab</button>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<RingViewer />} />
        <Route path="/debug" element={<DebugScene />} />
      </Routes>
    </>
  );
}
