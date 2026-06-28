import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Radio, Globe, FileCode, Circuitry } from '@phosphor-icons/react';
import EmployerPanel from './components/EmployerPanel';
import EmployeeClaim from './components/EmployeeClaim';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
  },
};

function App() {
  const [root, setRoot] = useState<string | null>(null);
  const [paths, setPaths] = useState<any[]>([]);

  return (
    <>
      <div className="bg-mesh" />
      <motion.div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100dvh',
          padding: '40px 24px 60px',
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <motion.header
            variants={itemVariants}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <ShieldCheck weight="fill" size={32} color="#34d399" />
              <h1
                style={{
                  fontSize: 'clamp(28px, 5vw, 40px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#f8fafc',
                }}
              >
                ZK Paycheck Shield
              </h1>
            </div>
            <p
              style={{
                fontSize: 15,
                color: '#94a3b8',
                maxWidth: 520,
                margin: '0 auto 24px',
                lineHeight: 1.6,
              }}
            >
              Privacy-preserving payroll on Stellar. Prove you are on the payroll
              without revealing who you are or how much you earn.
            </p>

            {/* Status Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                flexWrap: 'wrap',
              }}
            >
              <div className="status-bar">
                <div className="status-bar-item">
                  <div className="pulse-dot" />
                  <span>Testnet Live</span>
                </div>
                <div className="status-bar-item">
                  <Globe size={14} color="#64748b" />
                  <span>Stellar</span>
                </div>
                <div className="status-bar-item">
                  <Circuitry size={14} color="#64748b" />
                  <span>Protocol 26</span>
                </div>
                <div className="status-bar-item">
                  <Radio size={14} color="#64748b" />
                  <span className="mono">BN254</span>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Contract Info */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginBottom: 32,
              flexWrap: 'wrap',
            }}
          >
            <ContractPill
              icon={<FileCode size={14} color="#34d399" />}
              label="Payroll"
              address="CBC3PSZJP5XH72P4AXI3FNSPYTDBZ3DQBSS7OV5FMTL2EMSDDVXKKAFN"
            />
            <ContractPill
              icon={<ShieldCheck size={14} color="#34d399" />}
              label="Verifier"
              address="CCXIGG3XWVN44OZAXOIG4AWGDFQX46TPYFNNLTMN7ONBRH2VXS6Y52UA"
            />
          </motion.div>

          {/* Main Grid */}
          <motion.div
            variants={itemVariants}
            className="app-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 24,
            }}
          >
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
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function ContractPill({
  icon,
  label,
  address,
}: {
  icon: React.ReactNode;
  label: string;
  address: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 100,
        color: '#94a3b8',
        fontSize: 12,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Geist Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
      title="Click to copy"
    >
      {icon}
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span className="mono" style={{ color: copied ? '#34d399' : '#64748b' }}>
        {copied ? 'Copied!' : `${address.slice(0, 6)}...${address.slice(-4)}`}
      </span>
    </button>
  );
}

export default App;
