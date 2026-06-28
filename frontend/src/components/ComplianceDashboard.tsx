import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DownloadSimple,
  FileCsv,
  FileText,
  CheckCircle,
  Circle,
  Eye,
} from '@phosphor-icons/react';

interface Employee {
  name: string;
  amount: number;
}

interface ClaimRecord {
  nullifier: string;
  amount: number;
  timestamp?: string;
}

interface ComplianceDashboardProps {
  employees: Employee[];
  claimedRecords: ClaimRecord[];
}

export default function ComplianceDashboard({
  employees,
  claimedRecords,
}: ComplianceDashboardProps) {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const claimedNullifiers = useMemo(
    () => new Set(claimedRecords.map((r) => r.nullifier)),
    [claimedRecords]
  );

  // claimedNullifiers used for deduplication checks if needed
  void claimedNullifiers;

  const totalPayroll = useMemo(
    () => employees.reduce((sum, e) => sum + e.amount, 0),
    [employees]
  );

  const claimedTotal = useMemo(
    () => claimedRecords.reduce((sum, r) => sum + r.amount, 0),
    [claimedRecords]
  );

  const exportAudit = () => {
    const timestamp = new Date().toISOString();
    const auditData = {
      generatedAt: timestamp,
      summary: {
        totalEmployees: employees.length,
        totalPayroll,
        claimsProcessed: claimedRecords.length,
        claimedTotal,
        remainingTotal: totalPayroll - claimedTotal,
      },
      roster: employees.map((e) => {
        const record = claimedRecords.find((r) => r.amount === e.amount);
        return {
          name: e.name,
          amount: e.amount,
          status: record ? 'claimed' : 'unclaimed',
          nullifier: record?.nullifier || null,
          claimedAt: record?.timestamp || null,
        };
      }),
      nullifierRecords: claimedRecords.map((r) => ({
        nullifier: r.nullifier,
        amount: r.amount,
        timestamp: r.timestamp,
      })),
    };

    if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(auditData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll-audit-${timestamp.slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const rows = [
        ['Name', 'Amount', 'Status', 'Nullifier', 'Claimed At'],
        ...auditData.roster.map((r: any) => [
          r.name,
          r.amount.toString(),
          r.status,
          r.nullifier || '',
          r.claimedAt || '',
        ]),
        [],
        ['Nullifier', 'Amount', 'Timestamp'],
        ...auditData.nullifierRecords.map((r: any) => [
          r.nullifier,
          r.amount.toString(),
          r.timestamp || '',
        ]),
      ];
      const csv = rows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll-audit-${timestamp.slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{ padding: 32 }}
    >
      <div className="section-title">
        <Eye weight="fill" size={22} color="#34d399" />
        Compliance Dashboard
      </div>

      <p
        style={{
          fontSize: 14,
          color: '#94a3b8',
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        Employer-only audit view. See claim status and nullifier records for
        compliance reporting. Salaries remain private on-chain — this view
        shows only what the employer already knows.
      </p>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatBox
          label="Total Payroll"
          value={`${totalPayroll.toLocaleString()} XLM`}
          color="#34d399"
        />
        <StatBox
          label="Claims Processed"
          value={`${claimedRecords.length} / ${employees.length}`}
          color="#60a5fa"
        />
        <StatBox
          label="Disbursed"
          value={`${claimedTotal.toLocaleString()} XLM`}
          color="#fbbf24"
        />
        <StatBox
          label="Remaining"
          value={`${(totalPayroll - claimedTotal).toLocaleString()} XLM`}
          color="#a78bfa"
        />
      </div>

      {/* Roster Table */}
      <div
        style={{
          overflow: 'auto',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 24,
        }}
      >
        <table className="glass-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Employee</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th>Nullifier</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e, i) => {
              const record = claimedRecords.find((r) => r.amount === e.amount);
              const isClaimed = !!record;
              return (
                <tr key={i}>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      {isClaimed ? (
                        <CheckCircle
                          size={16}
                          weight="fill"
                          color="#34d399"
                        />
                      ) : (
                        <Circle size={16} color="#64748b" />
                      )}
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: isClaimed ? '#34d399' : '#64748b',
                        }}
                      >
                        {isClaimed ? 'Claimed' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: isClaimed
                            ? 'rgba(52,211,153,0.1)'
                            : 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          color: isClaimed ? '#34d399' : '#94a3b8',
                        }}
                      >
                        {e.name[0]}
                      </div>
                      {e.name}
                    </div>
                  </td>
                  <td
                    style={{ textAlign: 'right' }}
                    className="mono"
                  >
                    {e.amount.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className="mono"
                      style={{
                        fontSize: 12,
                        color: record ? '#94a3b8' : '#475569',
                      }}
                    >
                      {record
                        ? `${record.nullifier.slice(0, 8)}...${record.nullifier.slice(-8)}`
                        : '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Export */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setExportFormat('json')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background:
                exportFormat === 'json'
                  ? 'rgba(52,211,153,0.1)'
                  : 'rgba(255,255,255,0.04)',
              border: `1px solid ${exportFormat === 'json' ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 8,
              color: exportFormat === 'json' ? '#34d399' : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <FileText size={14} />
            JSON
          </button>
          <button
            onClick={() => setExportFormat('csv')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background:
                exportFormat === 'csv'
                  ? 'rgba(52,211,153,0.1)'
                  : 'rgba(255,255,255,0.04)',
              border: `1px solid ${exportFormat === 'csv' ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 8,
              color: exportFormat === 'csv' ? '#34d399' : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <FileCsv size={14} />
            CSV
          </button>
        </div>
        <button
          className="btn-glow"
          onClick={exportAudit}
          style={{ padding: '10px 20px', fontSize: 13 }}
        >
          <DownloadSimple weight="bold" size={16} />
          Export Audit Trail
        </button>
      </div>
    </motion.div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
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
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 18,
          fontWeight: 700,
          color,
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        {value}
      </p>
    </div>
  );
}
