import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TreeStructure,
  Copy,
  CheckCircle,
  Sparkle,
} from '@phosphor-icons/react';
import { buildMerkleTree, computeLeaf, bytesToHex } from '../utils/merkle';

interface Employee {
  name: string;
  amount: number;
}

interface EmployerPanelProps {
  onRootGenerated?: (root: string, paths: any[]) => void;
}

export default function EmployerPanel({ onRootGenerated }: EmployerPanelProps) {
  const [employees] = useState<Employee[]>([
    { name: 'Alice', amount: 1000 },
    { name: 'Bob', amount: 1500 },
    { name: 'Carol', amount: 2000 },
  ]);
  const [root, setRoot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyRoot = () => {
    if (!root) return;
    navigator.clipboard.writeText(root);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
      style={{ padding: 32 }}
    >
      <div className="section-title">
        <Users weight="fill" size={22} color="#34d399" />
        Employer Panel
      </div>

      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
        Define the payroll roster. The Merkle root is computed locally and committed
        on-chain. Individual salaries are never exposed.
      </p>

      <table className="glass-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th style={{ textAlign: 'right' }}>Amount (XLM)</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e, i) => (
            <tr key={i}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'rgba(52,211,153,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#34d399',
                    }}
                  >
                    {e.name[0]}
                  </div>
                  {e.name}
                </div>
              </td>
              <td style={{ textAlign: 'right' }} className="mono">
                {e.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="divider-gradient" />

      <button
        className="btn-glow"
        onClick={generateRoot}
        disabled={loading}
      >
        <TreeStructure weight="bold" size={18} />
        {loading ? 'Computing Merkle Tree...' : 'Generate Merkle Root'}
      </button>

      {root && (
        <motion.div
          className="root-display"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkle weight="fill" size={16} color="#34d399" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#34d399',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}
              >
                Merkle Root
              </span>
            </div>
            <button
              onClick={copyRoot}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: 8,
                color: '#34d399',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(52,211,153,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(52,211,153,0.1)';
              }}
            >
              {copied ? (
                <>
                  <CheckCircle size={14} weight="bold" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} weight="bold" />
                  Copy
                </>
              )}
            </button>
          </div>
          <p
            className="mono"
            style={{
              color: '#34d399',
              fontSize: 13,
              wordBreak: 'break-all',
              lineHeight: 1.5,
            }}
          >
            {root}
          </p>
          <p
            style={{
              fontSize: 12,
              color: '#64748b',
              marginTop: 12,
              lineHeight: 1.5,
            }}
          >
            This root is committed on-chain via{' '}
            <span className="mono" style={{ color: '#94a3b8' }}>
              set_payroll_root
            </span>
            . No individual salaries are revealed.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
