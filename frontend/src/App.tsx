import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Radio,
  Globe,
  FileCode,
  Circuitry,
  Users,
  Lock,
  Eye,
  Info,
} from '@phosphor-icons/react';
import EmployerPanel from './components/EmployerPanel';
import EmployeeClaim from './components/EmployeeClaim';
import ComplianceDashboard from './components/ComplianceDashboard';
import MerkleTreeViz from './components/MerkleTreeViz';
import BeforeAfter from './components/BeforeAfter';

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

const employees = [
  { name: 'Alice', amount: 1000 },
  { name: 'Bob', amount: 1500 },
  { name: 'Carol', amount: 2000 },
];

type TabKey = 'employer' | 'employee' | 'compliance' | 'about';

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('employer');
  const [root, setRoot] = useState<string | null>(null);
  const [paths, setPaths] = useState<any[]>([]);
  const [claimedRecords, setClaimedRecords] = useState<
    { nullifier: string; amount: number; timestamp: string }[]
  >([]);

  const handleClaimSuccess = (nullifier: string, amount: number) => {
    setClaimedRecords((prev) => [
      ...prev,
      { nullifier, amount, timestamp: new Date().toISOString() },
    ]);
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'employer', label: 'Employer', icon: <Users size={16} /> },
    { key: 'employee', label: 'Employee', icon: <Lock size={16} /> },
    {
      key: 'compliance',
      label: 'Compliance',
      icon: <Eye size={16} />,
    },
    { key: 'about', label: 'About ZK', icon: <Info size={16} /> },
  ];

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
              address="CDFGZNOBM2Y3P3LHY6MGURLXUEPVIPTX5EY5NGH3OLK6QQUZFJINWKLL"
            />
            <ContractPill
              icon={<ShieldCheck size={14} color="#34d399" />}
              label="Verifier"
              address="CBZ4FENUWDDKNRLNWK2UBUSV7AHKTBCADYMXQPGYUDVMTVXYINJNRLVF"
            />
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 32,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 14,
                padding: 5,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background:
                      activeTab === tab.key
                        ? 'rgba(255,255,255,0.08)'
                        : 'transparent',
                    color:
                      activeTab === tab.key ? '#f8fafc' : '#64748b',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'employer' && (
              <motion.div
                key="employer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div
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
                  <MerkleTreeViz
                    leaves={employees.map((e) => ({
                      name: e.name,
                      hash: '0'.repeat(64),
                    }))}
                    selectedIndex={
                      employees.findIndex((e) => e.name === 'Carol')
                    }
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'employee' && (
              <motion.div
                key="employee"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="app-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 24,
                  }}
                >
                  <EmployeeClaim
                    merkleRoot={root}
                    paths={paths}
                    employees={employees}
                    onClaimSuccess={handleClaimSuccess}
                  />
                  <BeforeAfter />
                </div>
              </motion.div>
            )}

            {activeTab === 'compliance' && (
              <motion.div
                key="compliance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ComplianceDashboard
                  employees={employees}
                  claimedRecords={claimedRecords}
                />
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <BeforeAfter />
              </motion.div>
            )}
          </AnimatePresence>
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
      <span
        className="mono"
        style={{ color: copied ? '#34d399' : '#64748b' }}
      >
        {copied ? 'Copied!' : `${address.slice(0, 6)}...${address.slice(-4)}`}
      </span>
    </button>
  );
}

export default App;
