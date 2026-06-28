import React, { useState } from 'react';
import { hashName, bytesToHex } from '../utils/merkle';

// snarkjs dynamic import for browser
declare const snarkjs: any;

interface EmployeeClaimProps {
  merkleRoot: string | null;
  paths: any[];
  employees: { name: string; amount: number }[];
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: '#94a3b8',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '10px',
  color: '#f8fafc',
  fontSize: '14px',
  marginBottom: '16px',
  outline: 'none',
  fontFamily: "'Geist Mono', 'Fira Code', monospace",
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
  marginRight: '10px',
  marginBottom: '10px',
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: 'rgba(255,255,255,0.08)',
  color: '#f8fafc',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '10px',
  color: '#f8fafc',
  fontSize: '13px',
  fontFamily: "'Geist Mono', 'Fira Code', monospace",
  outline: 'none',
  resize: 'vertical',
};

const statusBoxStyle = (success?: boolean): React.CSSProperties => ({
  marginTop: '16px',
  padding: '14px',
  background: success ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255,255,255,0.04)',
  border: `1px solid ${success ? 'rgba(52, 211, 153, 0.20)' : 'rgba(255,255,255,0.10)'}`,
  borderRadius: '10px',
  fontSize: '13px',
  color: success ? '#34d399' : '#94a3b8',
});

export default function EmployeeClaim({ merkleRoot, paths, employees }: EmployeeClaimProps) {
  const [name, setName] = useState('Carol');
  const [amount, setAmount] = useState(2000);
  const [proofJson, setProofJson] = useState('');
  const [status, setStatus] = useState('');
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateProofInBrowser = async () => {
    if (!merkleRoot) {
      setStatus('Wait for the employer to generate the Merkle root first.');
      setStatusSuccess(false);
      return;
    }
    setGenerating(true);
    setStatus('Generating proof in browser...');
    setStatusSuccess(false);
    try {
      const nameHash = await hashName(name);
      const idx = employees.findIndex((e) => e.name === name && e.amount === amount);
      if (idx === -1 || !paths[idx]) {
        setStatus('Employee not found in payroll.');
        setGenerating(false);
        return;
      }

      const path = paths[idx];

      // Convert values to match snarkjs expectations (strings in field element format)
      const pInput = {
        name_hash: '0x' + bytesToHex(nameHash),
        amount: amount.toString(),
        pathElements: path.elements.map((e: Uint8Array) => '0x' + bytesToHex(e)),
        pathIndices: path.indices,
        root: '0x' + merkleRoot,
        nullifier: '0x' + bytesToHex(nameHash),
      };

      console.log('Prover input:', pInput);

      // Load snarkjs from CDN if not present
      const snarkjsModule = (window as any).snarkjs || (await import('snarkjs'));

      const { proof, publicSignals } = await snarkjsModule.groth16.fullProve(
        pInput,
        '/paycheck.wasm',
        '/paycheck_final.zkey'
      );

      setProofJson(JSON.stringify(proof, null, 2));
      setStatus('Proof generated successfully in browser!');
      setStatusSuccess(true);
      console.log('Public signals:', publicSignals);
    } catch (err: any) {
      console.error(err);
      setStatus('Browser proving failed. Use Node.js fallback: npm run demo:proof');
      setStatusSuccess(false);
    } finally {
      setGenerating(false);
    }
  };

  const submitClaim = async () => {
    if (!proofJson) {
      setStatus('Generate or paste a proof first.');
      setStatusSuccess(false);
      return;
    }
    setStatus('Submitting claim to contract... (integrate Freighter here)');
    setStatusSuccess(false);
    // TODO: Integrate Freighter + soroban-client call
    // const proof = JSON.parse(proofJson);
    // const result = await payrollClient.claim({ amount, nullifier, proof });
  };

  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>Employee Claim</h2>
      <div>
        <label style={labelStyle}>Employee Name</label>
        <input
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Carol"
        />
      </div>
      <div>
        <label style={labelStyle}>Claim Amount (XLM)</label>
        <input
          style={inputStyle}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="e.g. 2000"
        />
      </div>
      <button
        style={buttonStyle}
        onClick={generateProofInBrowser}
        disabled={generating}
      >
        {generating ? 'Generating...' : 'Generate Proof (Browser)'}
      </button>
      <button
        style={secondaryButtonStyle}
        onClick={submitClaim}
      >
        Submit Claim
      </button>
      <div style={{ marginTop: '18px' }}>
        <label style={labelStyle}>Or paste proof JSON</label>
        <textarea
          style={textareaStyle}
          rows={6}
          value={proofJson}
          onChange={(e) => setProofJson(e.target.value)}
          placeholder='{"pi_a": [...], "pi_b": [...], "pi_c": [...]}'
        />
      </div>
      {status && (
        <div style={statusBoxStyle(statusSuccess)}>
          {status}
        </div>
      )}
    </div>
  );
}
