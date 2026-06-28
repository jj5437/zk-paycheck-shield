import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Lightning,
  PaperPlaneRight,
  CheckCircle,
  WarningCircle,
  Info,
} from '@phosphor-icons/react';
import { hashName, bytesToHex } from '../utils/merkle';

interface EmployeeClaimProps {
  merkleRoot: string | null;
  paths: any[];
  employees: { name: string; amount: number }[];
}

type StatusType = 'info' | 'success' | 'error';

interface Status {
  message: string;
  type: StatusType;
}

export default function EmployeeClaim({
  merkleRoot,
  paths,
  employees,
}: EmployeeClaimProps) {
  const [name, setName] = useState('Carol');
  const [amount, setAmount] = useState(2000);
  const [proofJson, setProofJson] = useState('');
  const [status, setStatus] = useState<Status | null>(null);
  const [generating, setGenerating] = useState(false);

  const generateProofInBrowser = async () => {
    if (!merkleRoot) {
      setStatus({
        message: 'Wait for the employer to generate the Merkle root first.',
        type: 'error',
      });
      return;
    }
    setGenerating(true);
    setStatus({ message: 'Generating zero-knowledge proof in browser...', type: 'info' });
    try {
      const nameHash = await hashName(name);
      const idx = employees.findIndex(
        (e) => e.name === name && e.amount === amount
      );
      if (idx === -1 || !paths[idx]) {
        setStatus({
          message: 'Employee not found in the current payroll roster.',
          type: 'error',
        });
        setGenerating(false);
        return;
      }

      const path = paths[idx];
      const pInput = {
        name_hash: '0x' + bytesToHex(nameHash),
        amount: amount.toString(),
        pathElements: path.elements.map((e: Uint8Array) => '0x' + bytesToHex(e)),
        pathIndices: path.indices,
        root: '0x' + merkleRoot,
        nullifier: '0x' + bytesToHex(nameHash),
      };

      const snarkjsModule =
        (window as any).snarkjs || (await import('snarkjs'));
      const { proof, publicSignals } = await snarkjsModule.groth16.fullProve(
        pInput,
        '/paycheck.wasm',
        '/paycheck_final.zkey'
      );

      setProofJson(JSON.stringify(proof, null, 2));
      setStatus({
        message: `Proof generated successfully. Public signals: ${publicSignals.length} field elements.`,
        type: 'success',
      });
    } catch (err: any) {
      console.error(err);
      setStatus({
        message:
          'Browser proving failed. Use Node.js fallback: npm run demo:proof',
        type: 'error',
      });
    } finally {
      setGenerating(false);
    }
  };

  const submitClaim = async () => {
    if (!proofJson) {
      setStatus({
        message: 'Generate or paste a proof first.',
        type: 'error',
      });
      return;
    }
    setStatus({
      message: 'Submitting claim to Stellar contract...',
      type: 'info',
    });
    // TODO: Integrate Freighter + soroban-client call
  };

  const statusIcon = (type: StatusType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} weight="fill" color="#34d399" />;
      case 'error':
        return <WarningCircle size={18} weight="fill" color="#f87171" />;
      default:
        return <Info size={18} weight="fill" color="#94a3b8" />;
    }
  };

  const statusClass = (type: StatusType) => {
    switch (type) {
      case 'success':
        return 'status-success';
      case 'error':
        return 'status-error';
      default:
        return 'status-info';
    }
  };

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.35 }}
      style={{ padding: 32 }}
    >
      <div className="section-title">
        <Lock weight="fill" size={22} color="#34d399" />
        Employee Claim
      </div>

      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
        Generate a zero-knowledge proof locally to claim your salary. Your name
        and exact amount remain private. Only the proof and nullifier reach the
        chain.
      </p>

      <div style={{ marginBottom: 18 }}>
        <label className="glass-label">Employee Name</label>
        <input
          className="glass-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Carol"
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label className="glass-label">Claim Amount (XLM)</label>
        <input
          className="glass-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="e.g. 2000"
        />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <button
          className="btn-glow"
          onClick={generateProofInBrowser}
          disabled={generating}
        >
          <Lightning weight="bold" size={18} />
          {generating ? 'Generating Proof...' : 'Generate Proof'}
        </button>
        <button className="btn-secondary" onClick={submitClaim}>
          <PaperPlaneRight weight="bold" size={18} />
          Submit Claim
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label className="glass-label">Or Paste Proof JSON</label>
        <textarea
          className="glass-textarea"
          rows={5}
          value={proofJson}
          onChange={(e) => setProofJson(e.target.value)}
          placeholder='{"pi_a": [...], "pi_b": [...], "pi_c": [...]}'
        />
      </div>

      <AnimatePresence mode="wait">
        {status && (
          <motion.div
            key={status.message}
            className={statusClass(status.type)}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <div style={{ marginTop: 2 }}>{statusIcon(status.type)}</div>
              <span
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color:
                    status.type === 'success'
                      ? '#34d399'
                      : status.type === 'error'
                      ? '#f87171'
                      : '#94a3b8',
                }}
              >
                {status.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
