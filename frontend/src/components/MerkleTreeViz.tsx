import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeStructure, Hash } from '@phosphor-icons/react';

interface MerkleTreeVizProps {
  leaves: { name: string; hash: string }[];
  selectedIndex: number;
}

export default function MerkleTreeViz({
  leaves,
  selectedIndex,
}: MerkleTreeVizProps) {
  const [animating, setAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setAnimating(true);
    setCurrentStep(0);
    const timer = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= 3) {
          clearInterval(timer);
          setAnimating(false);
          return s;
        }
        return s + 1;
      });
    }, 900);
    return () => clearInterval(timer);
  }, [selectedIndex]);

  const paddedLeaves = [...leaves];
  while (paddedLeaves.length < 4) {
    paddedLeaves.push({ name: '—', hash: '0'.repeat(64) });
  }

  const level1 = [
    hashPair(paddedLeaves[0].hash, paddedLeaves[1].hash, 'L1-0'),
    hashPair(paddedLeaves[2].hash, paddedLeaves[3].hash, 'L1-1'),
  ];
  const root = hashPair(level1[0], level1[1], 'Root');

  const getNodeStatus = (level: number, idx: number) => {
    const isSelected =
      level === 0 && idx === selectedIndex;
    const isSibling =
      level === 0 &&
      idx ===
        (selectedIndex % 2 === 0
          ? selectedIndex + 1
          : selectedIndex - 1);
    const parentIdx = Math.floor(selectedIndex / 2);
    const isParentSibling =
      level === 1 &&
      idx ===
        (parentIdx % 2 === 0
          ? parentIdx + 1
          : parentIdx - 1);
    const isParent = level === 1 && idx === parentIdx;
    const isRoot = level === 2 && idx === 0;

    return {
      isSelected,
      isSibling: isSibling || isParentSibling,
      isPath: isSelected || isParent || isRoot,
    };
  };

  const stepVisible = (level: number) => {
    if (!animating) return true;
    if (level === 0) return currentStep >= 0;
    if (level === 1) return currentStep >= 1;
    if (level === 2) return currentStep >= 2;
    return true;
  };

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
      style={{ padding: 32 }}
    >
      <div className="section-title">
        <TreeStructure weight="fill" size={22} color="#34d399" />
        Merkle Tree Proof Path
      </div>

      <p
        style={{
          fontSize: 14,
          color: '#94a3b8',
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        Visualize how your leaf hashes up to the root. The ZK proof hides the
        sibling nodes and path indices while cryptographically proving
        inclusion.
      </p>

      {/* Tree */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          padding: '16px 0',
        }}
      >
        {/* Root */}
        <AnimatePresence>
          {stepVisible(2) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              <TreeNode
                label="Merkle Root"
                hash={root}
                isHighlighted={true}
                color="#34d399"
                icon=<Hash size={14} weight="bold" />
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connectors root -> level 1 */}
        <div style={{ display: 'flex', gap: 120, position: 'relative' }}>
          <Connector visible={stepVisible(2)} />
          <Connector visible={stepVisible(2)} />
        </div>

        {/* Level 1 */}
        <div style={{ display: 'flex', gap: 24 }}>
          {level1.map((h, i) => {
            const status = getNodeStatus(1, i);
            return (
              <AnimatePresence key={i}>
                {stepVisible(1) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 18,
                      delay: i * 0.1,
                    }}
                  >
                    <TreeNode
                      label={`Level 1 — Node ${i}`}
                      hash={h}
                      isHighlighted={status.isPath}
                      isSibling={status.isSibling}
                      color={status.isPath ? '#60a5fa' : undefined}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Connectors level 1 -> leaves */}
        <div style={{ display: 'flex', gap: 32, position: 'relative' }}>
          {[0, 1, 2, 3].map((i) => (
            <Connector
              key={i}
              visible={stepVisible(1)}
              delay={i * 0.05}
            />
          ))}
        </div>

        {/* Leaves */}
        <div style={{ display: 'flex', gap: 12 }}>
          {paddedLeaves.map((leaf, i) => {
            const status = getNodeStatus(0, i);
            return (
              <AnimatePresence key={i}>
                {stepVisible(0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 18,
                      delay: i * 0.06,
                    }}
                  >
                    <TreeNode
                      label={leaf.name}
                      hash={leaf.hash}
                      isHighlighted={status.isSelected}
                      isSibling={status.isSibling}
                      color={
                        status.isSelected
                          ? '#34d399'
                          : status.isSibling
                          ? '#fbbf24'
                          : undefined
                      }
                      isLeaf
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <LegendItem color="#34d399" label="Your Leaf" />
        <LegendItem color="#fbbf24" label="Sibling Node" />
        <LegendItem color="#60a5fa" label="Path Node" />
      </div>
    </motion.div>
  );
}

function TreeNode({
  label,
  hash,
  isHighlighted,
  isSibling,
  color,
  icon,
  isLeaf,
}: {
  label: string;
  hash: string;
  isHighlighted?: boolean;
  isSibling?: boolean;
  color?: string;
  icon?: React.ReactNode;
  isLeaf?: boolean;
}) {
  const displayHash = `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  const borderColor = color || 'rgba(255,255,255,0.08)';
  const bgColor = isHighlighted
    ? `${color}15`
    : isSibling
    ? 'rgba(251,191,36,0.08)'
    : 'rgba(255,255,255,0.03)';

  return (
    <div
      style={{
        padding: isLeaf ? '14px 16px' : '12px 18px',
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 12,
        minWidth: isLeaf ? 120 : 160,
        textAlign: 'center',
        transition: 'all 0.3s ease',
        boxShadow: isHighlighted
          ? `0 0 20px ${color}20`
          : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 6,
        }}
      >
        {icon && <span style={{ color }}>{icon}</span>}
        <span
          style={{
            fontSize: isLeaf ? 13 : 11,
            fontWeight: 600,
            color: isHighlighted ? color : '#94a3b8',
          }}
        >
          {label}
        </span>
      </div>
      <p
        className="mono"
        style={{
          fontSize: 10,
          color: '#64748b',
          letterSpacing: '0.02em',
        }}
      >
        {displayHash}
      </p>
    </div>
  );
}

function Connector({
  visible,
  delay = 0,
}: {
  visible: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={
        visible
          ? { opacity: 1, scaleY: 1 }
          : { opacity: 0, scaleY: 0 }
      }
      transition={{ duration: 0.4, delay }}
      style={{
        width: 1,
        height: 24,
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
        transformOrigin: 'top',
      }}
    />
  );
}

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: '#94a3b8',
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: color,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
      {label}
    </div>
  );
}

function hashPair(a: string, b: string, _label: string): string {
  // Demo: deterministic "hash" for visualization
  const combined = a + b;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(64, '0');
  return hex.slice(0, 64);
}
