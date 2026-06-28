import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeSlash,
  Globe,
  ShieldCheck,
  ArrowRight,
  Fingerprint,
  FileText,
  LockKey,
} from '@phosphor-icons/react';

export default function BeforeAfter() {
  const [activeSide, setActiveSide] = useState<'before' | 'after'>('before');

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{ padding: 32 }}
    >
      <div className="section-title">
        <ShieldCheck weight="fill" size={22} color="#34d399" />
        Privacy Impact
      </div>

      <p
        style={{
          fontSize: 14,
          color: '#94a3b8',
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        See what a blockchain explorer reveals in a traditional payroll system
        versus ZK Paycheck Shield. Toggle between the two worlds.
      </p>

      {/* Toggle */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={() => setActiveSide('before')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 10,
            border: 'none',
            background:
              activeSide === 'before'
                ? 'rgba(248,113,113,0.15)'
                : 'transparent',
            color: activeSide === 'before' ? '#f87171' : '#64748b',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Eye size={16} />
          Traditional Payroll
        </button>
        <button
          onClick={() => setActiveSide('after')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 10,
            border: 'none',
            background:
              activeSide === 'after'
                ? 'rgba(52,211,153,0.15)'
                : 'transparent',
            color: activeSide === 'after' ? '#34d399' : '#64748b',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <EyeSlash size={16} />
          ZK Shield
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeSide === 'before' ? (
          <motion.div
            key="before"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ExplorerCard
              title="Stellar Expert — Public Ledger"
              subtitle="Transaction 0x3a7f...e92d"
              icon=<Globe size={16} color="#f87171" />
              accent="#f87171"
            >
              <div style={{ marginBottom: 16 }}>
                <ExplorerField
                  label="Operation Type"
                  value="Payment"
                />
                <ExplorerField
                  label="From"
                  value="GDAE...M7KQ (Payroll Contract)"
                />
                <ExplorerField
                  label="To"
                  value="GCBL...X9P2 (Alice)"
                />
                <ExplorerField
                  label="Amount"
                  value="1,000 XLM"
                  highlight
                />
                <ExplorerField
                  label="Memo"
                  value="Monthly salary — Alice Johnson"
                  highlight
                />
              </div>

              <div
                style={{
                  padding: 12,
                  background: 'rgba(248,113,113,0.06)',
                  borderRadius: 10,
                  border: '1px solid rgba(248,113,113,0.12)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Eye size={14} color="#f87171" />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#f87171',
                    }}
                  >
                    Fully Public
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    lineHeight: 1.5,
                  }}
                >
                  Anyone with the transaction hash can see exactly who was paid
                  and how much. Competitors, creditors, and data brokers can
                  scrape this information.
                </p>
              </div>
            </ExplorerCard>
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ExplorerCard
              title="Stellar Expert — ZK Shield"
              subtitle="Transaction 9e8947...1b888"
              icon=<ShieldCheck size={16} color="#34d399" />
              accent="#34d399"
            >
              <div style={{ marginBottom: 16 }}>
                <ExplorerField
                  label="Operation Type"
                  value="Contract Call — claim()"
                />
                <ExplorerField
                  label="Contract"
                  value="CDFG...WKLL (Payroll)"
                />
                <ExplorerField
                  label="Caller"
                  value="GXXX...XXXX (Anonymous)"
                />
                <ExplorerField
                  label="Amount"
                  value="[REDACTED — verified in ZK]"
                  isPrivate
                />
                <ExplorerField
                  label="Identity"
                  value="[REDACTED — verified in ZK]"
                  isPrivate
                />
                <ExplorerField
                  label="Nullifier"
                  value="0x8f2a...b91c"
                  isHash
                />
                <ExplorerField
                  label="Proof π"
                  value="0x1a3d...e72f (Groth16, BN254)"
                  isHash
                />
              </div>

              <div
                style={{
                  padding: 12,
                  background: 'rgba(52,211,153,0.06)',
                  borderRadius: 10,
                  border: '1px solid rgba(52,211,153,0.12)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <LockKey size={14} color="#34d399" />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#34d399',
                    }}
                  >
                    Zero-Knowledge Protected
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    lineHeight: 1.5,
                  }}
                >
                  The explorer shows only a proof and a nullifier. The actual
                  identity and amount are verified cryptographically without
                  ever appearing on-chain. Privacy by design.
                </p>
              </div>
            </ExplorerCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key differences */}
      <div
        style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        <DiffCard
          icon=<Fingerprint size={18} color="#f87171" />
          title="Identity Exposure"
          before="Full name + address visible"
          after="Only nullifier hash visible"
        />
        <DiffCard
          icon=<FileText size={18} color="#fbbf24" />
          title="Salary Exposure"
          before="Exact amount on-chain"
          after="Amount hidden in proof"
        />
        <DiffCard
          icon=<ShieldCheck size={18} color="#34d399" />
          title="Auditability"
          before="Manual reconciliation"
          after="Nullifier trail + ZK proof"
        />
        <DiffCard
          icon=<LockKey size={18} color="#60a5fa" />
          title="Compliance"
          before="Hard to prove privacy"
          after="Cryptographic guarantee"
        />
      </div>
    </motion.div>
  );
}

function ExplorerCard({
  title,
  subtitle,
  icon,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `${accent}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>
              {title}
            </p>
            <p
              className="mono"
              style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

function ExplorerField({
  label,
  value,
  isPrivate,
  isHash,
  highlight,
}: {
  label: string;
  value: string;
  isPrivate?: boolean;
  isHash?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isPrivate && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#34d399',
              background: 'rgba(52,211,153,0.1)',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            HIDDEN
          </span>
        )}
        <span
          className="mono"
          style={{
            fontSize: 12,
            color: highlight
              ? '#f8fafc'
              : isHash
              ? '#94a3b8'
              : '#94a3b8',
            fontWeight: highlight ? 600 : 400,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function DiffCard({
  icon,
  title,
  before,
  after,
}: {
  icon: React.ReactNode;
  title: string;
  before: string;
  after: string;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}
      >
        {icon}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 11, color: '#f87171' }}>{before}</span>
          <ArrowRight size={12} color="#64748b" />
          <span style={{ fontSize: 11, color: '#34d399' }}>{after}</span>
        </div>
      </div>
    </div>
  );
}
