// blockchain/verifier.js — CarboNexFarm blockchain simulation
// Production: replace with Web3.js / ethers.js calls to an actual EVM chain
const crypto = require("crypto");

/**
 * Simulate broadcasting a transaction to the CarboNexFarm network.
 * @param {{ from:string, to:string, credits:number, value:number }} payload
 * @returns {Promise<Object>} transaction receipt
 */
async function broadcastTransaction(payload) {
  // Simulate mining delay (2–3 seconds)
  await new Promise(r => setTimeout(r, 2200 + Math.random() * 800));

  const txHash      = "0x" + crypto.randomBytes(32).toString("hex");
  const blockNumber = Math.floor(18_000_000 + Math.random() * 500_000);

  return {
    txHash,
    blockNumber,
    gasUsed:   21_000,
    network:   process.env.BLOCKCHAIN_NETWORK || "carbonex-mainnet-1",
    status:    "confirmed",
    timestamp: new Date().toISOString(),
    payload,
  };
}

/**
 * Verify an existing transaction hash.
 * @param {string} txHash
 * @returns {Promise<Object>}
 */
async function verifyTransaction(txHash) {
  await new Promise(r => setTimeout(r, 600));
  return {
    txHash,
    verified:      true,
    confirmations: Math.floor(12 + Math.random() * 1000),
    network:       process.env.BLOCKCHAIN_NETWORK || "carbonex-mainnet-1",
  };
}

module.exports = { broadcastTransaction, verifyTransaction };
