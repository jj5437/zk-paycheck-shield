import React, { useState } from 'react';
import { buildMerkleTree, computeLeaf, bytesToHex } from '../utils/merkle';

interface Employee {
  name: string;
  amount: number;
}

interface EmployerPanelProps {
  onRootGenerated?: (root: string, paths: any[]) => void;
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '16px',
  padding: '28px',
  color: '#f8fafc',
};

const titleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 600,
  marginBottom: '20px',
  color: '#f8fafc',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '20px',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  color: '#94a3b8',
  fontSize: '12px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid rgba(255,255,255,0.10)',
};

const tdStyle: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  fontSize: '14px',
};

const monoStyle: React.CSSProperties = {
  fontFamily: "'Geist Mono', 'Fira Code', monospace",
  fontSize: '13px',
  letterSpacing: '-0.01em',
};

const buttonStyle: React.CSSProperties = {
  background: '#34d399',
  color: '#064e3b',
  border: 'none',
  borderRadius: '10px',
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const rootBoxStyle: React.CSSProperties = {
  marginTop: '20px',
  padding: '16px',
  background: 'rgba(52, 211, 153, 0.08)',
  border: '1px solid rgba(52, 211, 153, 0.20)',
  borderRadius: '12px',
};

export default function EmployerPanel({ onRootGenerated }: EmployerPanelProps) {
  const [employees] = useState<Employee[]>([
    { name: 'Alice', amount: 1000 },
    { name: 'Bob', amount: 1500 },
    { name: 'Carol', amount: 2000 },
  ]);
  const [root, setRoot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRoot = async () => {
    setLoading(true);
    try {
      const leaves = await Promise.all(
        employees.map((e) => computeLeaf(e.name, e.amount))
      );
      const tree = await buildMerkleTree(leaves);
      const rootHex = bytesToHex(tree.root);
      setRoot(rootHex);
      if (onRootGenerated) {
        onRootGenerated(rootHex, tree.paths);
      }
      console.log('Merkle root:', rootHex);
      console.log('Merkle paths:', tree.paths);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>Employer Panel</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Employee</th>
            <th style={thStyle}>Amount (XLM)</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e, i) => (
            <tr key={i}>
              <td style={tdStyle}>{e.name}</td>
              <td style={{ ...tdStyle, ...monoStyle }}>{e.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        style={buttonStyle}
        onClick={generateRoot}
        disabled={loading}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.opacity = '1';
        }}
      >
        {loading ? 'Computing...' : 'Generate Merkle Root'}
      </button>
      {root && (
        <div style={rootBoxStyle}>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Merkle Root
          </p>
          <p style={{ ...monoStyle, color: '#34d399', wordBreak: 'break-all' }}>
            {root}
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
            Save this root to deploy on-chain via set_payroll_root.
          </p>
        </div>
      )}
    </div>
  );
}
