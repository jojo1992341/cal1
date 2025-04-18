import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';

const lightTheme = {
  '--bg-color': '#f8fafd',
  '--nav-bg': '#f0f0f0',
  '--primary': '#007bff',
  '--text': '#234',
  '--nav-link': '#333',
  '--nav-link-active': '#007bff',
  '--border': '#dde4ec',
};
const darkTheme = {
  '--bg-color': '#181c24',
  '--nav-bg': '#232a36',
  '--primary': '#4fa3ff',
  '--text': '#f6f8fa',
  '--nav-link': '#b5c1d6',
  '--nav-link-active': '#4fa3ff',
  '--border': '#2b3240',
};

// Inject a CSS transition for theme changes
function injectThemeTransition() {
  if (document.getElementById('theme-transition')) return;
  const style = document.createElement('style');
  style.id = 'theme-transition';
  style.innerHTML = `
    body, #root {
      transition: background 0.7s cubic-bezier(.77,0,.18,1), color 0.7s cubic-bezier(.77,0,.18,1);
    }
    nav, form, .card, .history-list, .svg-theme {
      transition: background 0.7s cubic-bezier(.77,0,.18,1), color 0.7s cubic-bezier(.77,0,.18,1), border-color 0.7s cubic-bezier(.77,0,.18,1);
    }
  `;
  document.head.appendChild(style);
}

function App() {
  const [dark, setDark] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    injectThemeTransition();
    const theme = dark ? darkTheme : lightTheme;
    Object.entries(theme).forEach(([k, v]) => document.body.style.setProperty(k, v));
    document.body.style.background = theme['--bg-color'];
    document.body.style.color = theme['--text'];
  }, [dark]);

  return (
    <Router>
      <nav style={{ padding: '1rem', background: 'var(--nav-bg)', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)' }}>
        <Link to="/" style={({ isActive }) => ({ color: isActive ? 'var(--nav-link-active)' : 'var(--nav-link)', fontWeight: 'bold', textDecoration: 'none' })}>Accueil</Link>
        <Link to="/history" style={({ isActive }) => ({ color: isActive ? 'var(--nav-link-active)' : 'var(--nav-link)', fontWeight: 'bold', textDecoration: 'none' })}>Historique</Link>
        <button
          aria-label={dark ? 'Activer le thème clair' : 'Activer le thème sombre'}
          onClick={() => setDark(d => !d)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 18 }}
        >
          {dark ? '☀️ Thème clair' : '🌙 Thème sombre'}
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
