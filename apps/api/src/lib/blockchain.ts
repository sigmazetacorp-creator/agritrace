import { ethers } from 'ethers'

// Minimal ABI — only the functions we call
const ABI = [
  'function recordHarvest(string calldata qrCode, bytes32 dataHash) external',
  'function recordShipment(string calldata shipmentId, bytes32 dataHash) external',
  'function getHarvest(string calldata qrCode) external view returns (bytes32, address, uint256, bool)',
  'function verifyHarvest(string calldata qrCode, bytes32 dataHash) external view returns (bool)',
  'event HarvestRecorded(string indexed qrCode, bytes32 dataHash, address indexed recorder, uint256 timestamp)',
]

function getContract() {
  const rpcUrl = process.env.POLYGON_RPC_URL
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY
  const contractAddress = process.env.CONTRACT_ADDRESS

  if (!rpcUrl || rpcUrl.includes('YOUR_KEY')) return null
  if (!privateKey || privateKey === '0x...') return null
  if (!contractAddress) return null

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)
  return new ethers.Contract(contractAddress, ABI, wallet)
}

/**
 * Compute a keccak256 hash of harvest fields for on-chain storage.
 * The same inputs always produce the same hash — buyers can recompute and verify.
 */
export function hashHarvest(data: {
  qrCode: string
  cropType: string
  quantityKg: number
  farmId: string
  harvestDate: string
}): string {
  return ethers.keccak256(
    ethers.toUtf8Bytes(
      `${data.qrCode}|${data.cropType}|${data.quantityKg}|${data.farmId}|${data.harvestDate}`
    )
  )
}

/**
 * Record a harvest on-chain. Returns the tx hash, or null if blockchain is not configured.
 */
export async function recordHarvestOnChain(
  qrCode: string,
  dataHash: string
): Promise<string | null> {
  const contract = getContract()
  if (!contract) {
    console.log('[blockchain] Not configured — skipping on-chain write')
    return null
  }

  try {
    const tx = await contract.recordHarvest(qrCode, dataHash)
    const receipt = await tx.wait()
    console.log(`[blockchain] Harvest recorded: ${receipt.hash}`)
    return receipt.hash
  } catch (err: any) {
    console.error('[blockchain] recordHarvest failed:', err.message)
    return null
  }
}

/**
 * Record a shipment on-chain. Returns the tx hash, or null if not configured.
 */
export async function recordShipmentOnChain(
  shipmentId: string,
  dataHash: string
): Promise<string | null> {
  const contract = getContract()
  if (!contract) return null

  try {
    const tx = await contract.recordShipment(shipmentId, dataHash)
    const receipt = await tx.wait()
    console.log(`[blockchain] Shipment recorded: ${receipt.hash}`)
    return receipt.hash
  } catch (err: any) {
    console.error('[blockchain] recordShipment failed:', err.message)
    return null
  }
}
