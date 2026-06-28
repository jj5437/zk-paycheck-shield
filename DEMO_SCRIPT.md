# ZK Paycheck Shield — Demo Script

**Last Updated:** 2026-06-28

---

## 🚀 启动项目

```bash
cd /Users/wangke/project/hackthon/zk-paycheck-shield/frontend
npm run dev
```

打开浏览器：`http://localhost:5173`

---

## 🎬 演示流程（建议 2-3 分钟）

### 1. 开场 — About ZK 标签（30 秒）

点击 **About ZK** 标签。

- 展示 **Traditional Payroll** 侧：
  - "在传统薪资系统中，任何人都能在区块链浏览器上看到谁被支付了多少钱"
  - 点击切换按钮展示 **ZK Shield** 侧
- 展示 **ZK Shield** 侧：
  - "使用零知识证明，链上只显示 proof 和 nullifier，实际身份和金额完全隐藏"
  - 下方 4 张对比卡片快速扫过

**台词要点：** "这是我们的核心问题 — 薪资隐私。ZK Paycheck Shield 让雇主能验证员工在薪资名单上，但员工的身份和工资金额永远不会暴露在链上。"

---

### 2. 雇主操作 — Employer 标签（45 秒）

点击 **Employer** 标签。

- 展示 **Employer Panel**：
  - 3 名员工：Alice (1,000 XLM)、Bob (1,500 XLM)、Carol (2,000 XLM)
  - "雇主已经知道这些信息，这是他们的内部数据"
- 点击 **Generate Merkle Root**：
  - 等待计算完成（约 1-2 秒）
  - 展示生成的 Merkle Root（绿色高亮）
  - "这个 Root 会被提交到链上，但单个员工的薪资信息永远不会泄露"
- 展示右侧 **Merkle Tree Proof Path**：
  - 动画展示从 Leaf → Level 1 → Root 的路径
  - Carol 的叶子被高亮（绿色）
  - Sibling node（黄色）和 Path node（蓝色）说明 ZK 证明如何用 siblings 构建路径

**台词要点：** "雇主在本地计算 Merkle Root 并提交到链上。右侧的可视化展示了 Carol 的证明路径 — 她需要知道自己的 leaf 和 sibling nodes 来生成零知识证明。"

---

### 3. 员工操作 — Employee 标签（60 秒）

点击 **Employee** 标签。

- 展示 **Employee Claim** 面板：
  - 默认选择 Carol，金额 2,000
  - "Carol 想领取她的工资。她知道自己的名字和金额，这是她的私有输入"
- 点击 **Generate Proof**：
  - 浏览器内使用 snarkjs + Circom WASM 生成 Groth16 证明
  - 成功后会显示 Proof JSON 和成功消息
  - "证明在浏览器本地生成，没有任何数据发送到服务器"
- 点击 **Submit Claim**：
  - 模拟提交到 Stellar 合约（当前前端使用模拟提交）
  - 成功消息出现

**台词要点：** "Carol 在浏览器里本地生成零知识证明。这个证明数学上保证了两件事：她在薪资名单上，而且她的金额在合法范围内 — 但证明本身不包含她的名字或具体金额。"

**技术亮点台词：** "这个电路有 1,015 个约束，包含 Merkle inclusion 证明和 range proof。我们使用 Stellar Protocol 26 的 BN254 曲线在链上验证。"

---

### 4. 合规审计 — Compliance 标签（30 秒）

点击 **Compliance** 标签。

- 展示 **Compliance Dashboard**：
  - 统计卡片：Total Payroll 4,500 XLM、Claims Processed 1/3、Disbursed 2,000 XLM
  - 员工表格：Carol 显示 "Claimed"（绿色勾选），Alice 和 Bob 显示 "Pending"
  - Nullifier 列显示 Carol 的匿名标识符
- 点击 **Export Audit Trail**：
  - 选择 JSON 或 CSV 格式
  - "雇主可以导出完整的审计记录用于合规报告，但员工的隐私仍然受到保护"

**台词要点：** "雇主需要合规和审计能力。这个仪表板展示了雇主视角 — 他们知道谁已领取，但所有这些信息都是他们已经知道的内部数据。链上依然只有 nullifier 和 proof。"

---

## 🔗 链上验证（可选加分项）

如果你想展示真实的链上交易：

```bash
cd /Users/wangke/project/hackthon/zk-paycheck-shield

# 生成 Bob 的证明并提交（如果 Bob 还没被 claim）
node scripts/generate-demo-input.js  # 生成 demo input
node scripts/generate-proof.js circuits/demo_input.json circuits/paycheck_js/paycheck.wasm circuits/paycheck_final.zkey
node scripts/submit-claim.js
```

**合约地址：**
- Payroll: `CDFGZNOBM2Y3P3LHY6MGURLXUEPVIPTX5EY5NGH3OLK6QQUZFJINWKLL`
- Verifier: `CBZ4FENUWDDKNRLNWK2UBUSV7AHKTBCADYMXQPGYUDVMTVXYINJNRLVF`

**成功交易示例：**
- https://stellar.expert/explorer/testnet/tx/9e8947038bc7d52bb49bb7da9a60632ac9ef6ea798c6ea576dda16f93a31b888

---

## 📝 评委可能问的问题

**Q: 你们和普通的 Merkle Tree 项目有什么区别？**
A: 大多数 hackathon 项目只做到 Merkle inclusion。我们额外实现了 **range proof**（金额在 1-10,000 XLM 之间）、**batch multi-claim**（批量处理）、以及完整的 **compliance dashboard**。这展示了更深层的 ZK 工程能力。

**Q: 为什么选 Stellar？**
A: Stellar Protocol 26 原生支持 BN254 曲线，可以直接在合约里做 Groth16 验证，不需要自定义预编译合约。这让 ZK 验证变得简单且 gas 高效。

**Q: 实际生产环境还需要什么？**
A: 主要是 Freighter 钱包集成（浏览器内签名）和真实 XLM token transfer。核心 ZK 架构已经完整且经过 testnet 验证。

---

## 🎯 技术亮点总结

| 特性 | 实现 |
|---|---|
| 电路约束 | 1,015（含 Range Proof）|
| 曲线 | BN254 on Stellar Protocol 26 |
| 证明系统 | Groth16 |
| 哈希函数 | Poseidon |
| 树深度 | 2（4 个 leaf）|
| 批量领取 | 支持 `batch_claim` |
| 合规审计 | JSON/CSV 导出 |
| 前端设计 | Frosted Vault（Glassmorphism）|

---

祝你演示顺利！🛡️
