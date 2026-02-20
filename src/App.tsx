import { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useProgress } from '@react-three/drei';
import DebugScene from './components/DebugScene';

const RingViewer = lazy(() => import('./components/RingViewer'));

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
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 2000, // Above canvas but below loader
      position: 'relative' as const,
    },
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '12px',
        zIndex: 1000,
      }}
    >
      <button {...btn('Ring Viewer', '/')}>Ring Viewer</button>
      <button {...btn('Debug Lab', '/debug')}>Debug Lab</button>
    </div>
  );
}

// Custom Loader that we can force to be visible
function LoadingScreen() {
  const { progress, active } = useProgress();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.5s ease, visibility 0.5s ease',
        opacity: active ? 1 : 0,
        visibility: active ? 'visible' : 'hidden',
        pointerEvents: active ? 'auto' : 'none',
        color: 'white',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          width: '300px',
          height: '4px',
          background: '#333',
          marginBottom: '1rem',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'white',
            width: `${progress}%`,
            transition: 'width 0.2s ease',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
          }}
        />
      </div>
      <div style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>
        LOADING {progress.toFixed(0)}%
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Nav />

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<RingViewer />} />
          <Route path="/debug" element={<DebugScene />} />
        </Routes>
      </Suspense>

      <LoadingScreen />
    </>
  );
}

export default App;
