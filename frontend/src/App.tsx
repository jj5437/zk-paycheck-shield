import React, { useState } from 'react';
import EmployerPanel from './components/EmployerPanel';
import EmployeeClaim from './components/EmployeeClaim';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0f172a',
  padding: '40px 24px',
};

const innerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '40px',
  textAlign: 'center',
};

const h1Style: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 700,
  color: '#f8fafc',
  marginBottom: '8px',
  letterSpacing: '-0.02em',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#94a3b8',
  maxWidth: '500px',
  margin: '0 auto',
  lineHeight: 1.5,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
};

const mobileGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
};

function App() {
  const [root, setRoot] = useState<string | null>(null);
  const [paths, setPaths] = useState<any[]>([]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <header style={headerStyle}>
          <h1 style={h1Style}>ZK Paycheck Shield</h1>
          <p style={subtitleStyle}>
            Privacy-preserving payroll on Stellar. Prove you are on the payroll without revealing who you are or how much you earn.
          </p>
        </header>
        <div style={isMobile ? mobileGridStyle : gridStyle}>
          <EmployerPanel
            onRootGenerated={(r, p) => {
              setRoot(r);
              setPaths(p);
            }}
          />
          <EmployeeClaim
            merkleRoot={root}
            paths={paths}
            employees={[
              { name: 'Alice', amount: 1000 },
              { name: 'Bob', amount: 1500 },
              { name: 'Carol', amount: 2000 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
