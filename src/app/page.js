'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const styles = {
  page: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '48px 20px', background: 'var(--bg)' },
  card: { width: '100%', maxWidth: '460px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', boxShadow: '0 1px 2px rgba(20,20,43,0.04), 0 12px 32px rgba(20,20,43,0.06)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' },
  eyebrow: { fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--violet)', fontWeight: 600 },
  networkBadge: { fontSize: '11px', fontWeight: 600, color: 'var(--emerald)', background: 'var(--emerald-soft)', padding: '4px 10px', borderRadius: '999px' },
  title: { fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', margin: '4px 0 2px' },
  subtitle: { fontSize: '14px', color: 'var(--ink-soft)', margin: '0 0 24px' },
  connectBtn: { width: '100%', padding: '14px', fontSize: '15px', fontWeight: 600, color: '#fff', background: 'var(--metamask)', border: 'none', borderRadius: '12px', cursor: 'pointer' },
  walletCard: { background: 'var(--violet-soft)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' },
  walletRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' },
  mutedLabel: { color: 'var(--ink-soft)', fontSize: '13px' },
  addressText: { fontWeight: 600, fontSize: '13px' },
  balanceText: { fontWeight: 700, fontSize: '14px' },
  section: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 14px', fontSize: '15px', border: '1px solid var(--border)', borderRadius: '12px', outline: 'none', color: 'var(--ink)' },
  pillValid: { display: 'inline-block', marginTop: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--emerald)', background: 'var(--emerald-soft)', padding: '4px 10px', borderRadius: '999px' },
  pillInvalid: { display: 'inline-block', marginTop: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--red)', background: 'var(--red-soft)', padding: '4px 10px', borderRadius: '999px' },
  bridgeRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '4px 0 20px', flexWrap: 'wrap' },
  bridgePill: { fontSize: '12px', fontWeight: 600, background: 'var(--violet-soft)', color: 'var(--violet)', padding: '6px 10px', borderRadius: '999px' },
  arrow: { color: 'var(--ink-soft)', fontSize: '16px' },
  rateCard: { marginTop: '14px', background: 'var(--emerald-soft)', borderRadius: '12px', padding: '16px' },
  rateRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '6px' },
  rateDivider: { border: 'none', borderTop: '1px solid rgba(14,159,110,0.2)', margin: '10px 0' },
  rateFinalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: 'var(--emerald)' },
  sendBtn: { width: '100%', padding: '14px', fontSize: '15px', fontWeight: 600, color: '#fff', border: 'none', borderRadius: '12px' },
  pendingBanner: { marginTop: '16px', background: 'var(--amber-soft)', color: 'var(--amber)', fontSize: '13px', fontWeight: 600, padding: '12px 14px', borderRadius: '12px', textAlign: 'center' },
  successCard: { marginTop: '16px', background: 'var(--emerald-soft)', borderRadius: '12px', padding: '14px 16px' },
  successTitle: { color: 'var(--emerald)', fontWeight: 700, fontSize: '14px', marginBottom: '6px' },
  hashLink: { fontSize: '12px', color: 'var(--violet)', wordBreak: 'break-all' },
  errorBanner: { marginTop: '16px', background: 'var(--red-soft)', color: 'var(--red)', fontSize: '13px', fontWeight: 600, padding: '12px 14px', borderRadius: '12px' },
  historyCard: { width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' },
  historyHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  historyTitle: { fontSize: '15px', fontWeight: 700, color: 'var(--ink)' },
  clearBtn: { fontSize: '12px', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  historyItem: { background: 'var(--bg)', borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' },
  historyRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  historyUpi: { fontWeight: 600, fontSize: '13px', color: 'var(--ink)' },
  historyAmount: { fontWeight: 700, fontSize: '13px', color: 'var(--emerald)' },
  historyMeta: { fontSize: '11px', color: 'var(--ink-soft)', marginTop: '4px' },
  historyEmpty: { fontSize: '13px', color: 'var(--ink-soft)', textAlign: 'center', padding: '10px 0' },
  riskCard: { marginTop: '14px', borderRadius: '12px', padding: '16px' },
  riskHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  riskLabel: { fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' },
  riskScore: { fontSize: '22px', fontWeight: 700 },
  riskReasons: { marginTop: '10px', fontSize: '12px', color: 'var(--ink-soft)' },
};

function formatAddress(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// ---- Distilled fraud-detection model (trained in Python with scikit-learn,
// exported as logistic regression coefficients so it can run instantly in
// the browser with zero extra server/backend needed) ----
const RISK_COEF = {
  intercept: -1.29637672,
  amount_inr: 0.00002756,
  hour_of_day: -0.02055197,
  is_new_recipient: 1.84060272,
  tx_count_last_24h: 0.36939121,
  wallet_age_days: -0.00027094,
  amount_deviation_ratio: 0.13807363,
};

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function computeRiskScore(f) {
  const z =
    RISK_COEF.intercept +
    RISK_COEF.amount_inr * f.amount_inr +
    RISK_COEF.hour_of_day * f.hour_of_day +
    RISK_COEF.is_new_recipient * f.is_new_recipient +
    RISK_COEF.tx_count_last_24h * f.tx_count_last_24h +
    RISK_COEF.wallet_age_days * f.wallet_age_days +
    RISK_COEF.amount_deviation_ratio * f.amount_deviation_ratio;

  const probability = sigmoid(z);

  const contributions = [
    { label: 'First-time recipient for this wallet', value: RISK_COEF.is_new_recipient * f.is_new_recipient },
    { label: 'Multiple transactions in the last 24 hours', value: RISK_COEF.tx_count_last_24h * f.tx_count_last_24h },
    { label: 'Amount is unusually large vs. your typical transfers', value: RISK_COEF.amount_deviation_ratio * f.amount_deviation_ratio },
    { label: 'This wallet is new to our records', value: f.wallet_age_days < 3 ? 0.8 : 0 },
  ];

  const reasons = contributions
    .filter((c) => c.value > 0.15)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((c) => c.label);

  return { probability, reasons };
}

function riskLevel(probability) {
  if (probability < 0.35) return { label: 'Low risk', color: 'var(--emerald)', bg: 'var(--emerald-soft)' };
  if (probability < 0.65) return { label: 'Medium risk', color: 'var(--amber)', bg: 'var(--amber-soft)' };
  return { label: 'High risk', color: 'var(--red)', bg: 'var(--red-soft)' };
}

function getWalletFirstSeen(address) {
  const key = `cryptoupi_wallet_first_seen_${address}`;
  let firstSeen = localStorage.getItem(key);
  if (!firstSeen) {
    firstSeen = Date.now().toString();
    localStorage.setItem(key, firstSeen);
  }
  return Number(firstSeen);
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletFirstSeen, setWalletFirstSeen] = useState(null);
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiValid, setUpiValid] = useState(null);
  const [ethAmount, setEthAmount] = useState('');
  const [inrRate, setInrRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cryptoupi_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.log('History load error:', e);
      }
    }
  },[]);

  function saveToHistory(record) {
    setHistory((prev) => {
      const updated = [record, ...prev].slice(0, 20);
      localStorage.setItem('cryptoupi_history', JSON.stringify(updated));
      return updated;
    });
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('cryptoupi_history');
  }

  async function connectWallet() {
    setError('');

    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask nahi mila! Pehle MetaMask extension install karo.');
      return;
    }

    try {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (switchError) {
        console.log('Network switch skipped:', switchError.message);
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      setWalletAddress(address);
      setWalletFirstSeen(getWalletFirstSeen(address));

      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);
    } catch (err) {
      setError('Connect karte waqt error aaya: ' + err.message);
    }
  }

  function checkUpiId(value) {
    setUpiId(value);
    const upiRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
    if (value.length === 0) {
      setUpiValid(null);
    } else {
      setUpiValid(upiRegex.test(value));
    }
  }

  async function fetchRateAndCalculate(amount) {
    setEthAmount(amount);

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setInrRate(null);
      return;
    }

    setLoadingRate(true);
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr'
      );
      const data = await res.json();
      const ethToInr = data.ethereum.inr;

      const totalInr = ethToInr * Number(amount);
      const fee = totalInr * 0.01;
      const finalInr = totalInr - fee;

      setInrRate({
        rate: ethToInr,
        total: totalInr.toFixed(2),
        fee: fee.toFixed(2),
        final: finalInr.toFixed(2),
      });
    } catch (err) {
      setError('Rate fetch karne mein error: ' + err.message);
    }
    setLoadingRate(false);
  }

  async function sendPayment() {
    setError('');
    setTxHash('');
    setTxStatus('');

    if (!ethAmount || Number(ethAmount) <= 0) {
      setError('Pehle kitna ETH bhejna hai, wo daalo.');
      return;
    }
    if (upiValid !== true) {
      setError('Pehle ek valid UPI ID daalo.');
      return;
    }

    try {
      setSending(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: walletAddress,
        value: ethers.parseEther(ethAmount),
      });

      setTxHash(tx.hash);
      setTxStatus('pending');

      await tx.wait();

      setTxStatus('confirmed');
      setUpiId('');
      setUpiValid(null);
      setEthAmount('');
      setInrRate(null);

      saveToHistory({
        wallet: walletAddress,
        upiId: upiId,
        ethAmount: ethAmount,
        inrFinal: inrRate ? inrRate.final : '0',
        hash: tx.hash,
        date: new Date().toLocaleString('en-IN'),
        timestamp: Date.now(),
      });

      const newBalanceWei = await provider.getBalance(walletAddress);
      setBalance(ethers.formatEther(newBalanceWei));
    } catch (err) {
      setError('Transaction fail ho gaya: ' + err.message);
    }
    setSending(false);
  }

  // ---- Live risk assessment, computed from real browser history ----
  let riskResult = null;
  if (walletAddress && upiValid === true && inrRate) {
    const myHistory = history.filter((h) => h.wallet === walletAddress);
    const isNewRecipient = !myHistory.some((h) => h.upiId === upiId) ? 1 : 0;
    const last24h = myHistory.filter((h) => Date.now() - h.timestamp < 24 * 60 * 60 * 1000).length;
    const pastAmounts = myHistory.map((h) => Number(h.inrFinal)).filter((n) => !isNaN(n) && n > 0);
    const avgPast = pastAmounts.length > 0 ? pastAmounts.reduce((a, b) => a + b, 0) / pastAmounts.length : Number(inrRate.total);
    const walletAgeDays = walletFirstSeen ? (Date.now() - walletFirstSeen) / (1000 * 60 * 60 * 24) : 0;

    const { probability, reasons } = computeRiskScore({
      amount_inr: Number(inrRate.total),
      hour_of_day: new Date().getHours(),
      is_new_recipient: isNewRecipient,
      tx_count_last_24h: last24h,
      wallet_age_days: walletAgeDays,
      amount_deviation_ratio: Number(inrRate.total) / avgPast,
    });

    riskResult = { probability, reasons, level: riskLevel(probability) };
  }

  return (
    <main style={styles.page}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '460px', gap: '20px' }}>
        <div style={styles.card}>
          <div style={styles.headerRow}>
            <div>
              <div style={styles.eyebrow}>Crypto wallet → UPI</div>
              <h1 style={styles.title}>CryptoUPI</h1>
            </div>
            <span style={styles.networkBadge}>Sepolia testnet</span>
          </div>
          <p style={styles.subtitle}>Send crypto straight to any UPI ID</p>

          {!walletAddress ? (
            <button onClick={connectWallet} style={styles.connectBtn}>
              Connect wallet
            </button>
          ) : (
            <>
              <div style={styles.walletCard}>
                <div style={styles.walletRow}>
                  <span style={styles.mutedLabel}>Wallet</span>
                  <span className="mono" style={styles.addressText} title={walletAddress}>{formatAddress(walletAddress)}</span>
                </div>
                <div style={{ ...styles.walletRow, marginTop: '6px' }}>
                  <span style={styles.mutedLabel}>Balance</span>
                  <span style={styles.balanceText}>{balance} SepoliaETH</span>
                </div>
              </div>

              <div style={styles.section}>
                <label style={styles.label}>Recipient UPI ID</label>
                <input type="text" placeholder="name@paytm" value={upiId} onChange={(e) => checkUpiId(e.target.value)} style={styles.input} />
                {upiValid === true && <span style={styles.pillValid}>Valid UPI ID</span>}
                {upiValid === false && <span style={styles.pillInvalid}>Check the format</span>}
              </div>

              {upiValid === true && (
                <div style={styles.bridgeRow}>
                  <span className="mono" style={styles.bridgePill}>{formatAddress(walletAddress)}</span>
                  <span style={styles.arrow}>→</span>
                  <span style={styles.bridgePill}>{upiId}</span>
                </div>
              )}

              <div style={styles.section}>
                <label style={styles.label}>Amount to send (ETH)</label>
                <input type="number" placeholder="0.01" value={ethAmount} onChange={(e) => fetchRateAndCalculate(e.target.value)} style={styles.input} />

                {loadingRate && <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '8px' }}>Checking live rate...</p>}

                {inrRate && (
                  <div style={styles.rateCard}>
                    <div style={styles.rateRow}><span>1 ETH</span><span>₹{inrRate.rate.toLocaleString('en-IN')}</span></div>
                    <div style={styles.rateRow}><span>Total value</span><span>₹{inrRate.total}</span></div>
                    <div style={styles.rateRow}><span>Fee (1%)</span><span>-₹{inrRate.fee}</span></div>
                    <hr style={styles.rateDivider} />
                    <div style={styles.rateFinalRow}><span>Recipient gets</span><span>₹{inrRate.final}</span></div>
                  </div>
                )}

                {riskResult && (
                  <div style={{ ...styles.riskCard, background: riskResult.level.bg }}>
                    <div style={styles.riskHeaderRow}>
                      <span style={styles.riskLabel}>🤖 AI Risk Assessment</span>
                      <span style={{ ...styles.riskScore, color: riskResult.level.color }}>
                        {riskResult.level.label} ({Math.round(riskResult.probability * 100)}%)
                      </span>
                    </div>
                    {riskResult.reasons.length > 0 ? (
                      <ul style={styles.riskReasons}>
                        {riskResult.reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    ) : (
                      <p style={styles.riskReasons}>No strong risk signals detected.</p>
                    )}
                  </div>
                )}
              </div>

              <button onClick={sendPayment} disabled={sending || upiValid !== true || !ethAmount} style={{ ...styles.sendBtn, background: sending || upiValid !== true || !ethAmount ? '#9CA3AF' : 'var(--emerald)', cursor: sending || upiValid !== true || !ethAmount ? 'not-allowed' : 'pointer' }}>
                {sending ? 'Processing...' : 'Send payment'}
              </button>

              {txStatus === 'pending' && <div style={styles.pendingBanner}>Waiting for network confirmation…</div>}

              {txStatus === 'confirmed' && (
                <div style={styles.successCard}>
                  <div style={styles.successTitle}>Payment successful (simulated UPI payout)</div>
                  <a className="mono" href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={styles.hashLink}>{formatAddress(txHash)} · view on Etherscan</a>
                </div>
              )}
            </>
          )}

          {error && <div style={styles.errorBanner}>{error}</div>}
        </div>

        {walletAddress && (
          <div style={styles.historyCard}>
            <div style={styles.historyHeaderRow}>
              <span style={styles.historyTitle}>Recent transactions</span>
              {history.length > 0 && <button onClick={clearHistory} style={styles.clearBtn}>Clear</button>}
            </div>

            {history.length === 0 ? (
              <p style={styles.historyEmpty}>Abhi tak koi transaction nahi hui hai.</p>
            ) : (
              history.map((item, idx) => (
                <div key={idx} style={styles.historyItem}>
                  <div style={styles.historyRow}>
                    <span style={styles.historyUpi}>{item.upiId}</span>
                    <span style={styles.historyAmount}>₹{item.inrFinal}</span>
                  </div>
                  <div style={styles.historyMeta}>
                    {item.date} · {item.ethAmount} ETH · <a className="mono" href={`https://sepolia.etherscan.io/tx/${item.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--violet)' }}>view</a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}