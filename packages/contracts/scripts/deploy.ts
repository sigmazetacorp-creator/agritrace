import { ethers } from 'hardhat'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying AgriTrace with:', deployer.address)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance:', ethers.formatEther(balance), 'MATIC')

  const AgriTrace = await ethers.getContractFactory('AgriTrace')
  const contract = await AgriTrace.deploy()
  await contract.waitForDeployment()

  const address = await contract.getAddress()
  console.log('AgriTrace deployed to:', address)

  // Write the deployed address to a JSON file so the API can pick it up
  const deployment = {
    address,
    network: 'amoy',
    chainId: 80002,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
  }

  const outPath = path.join(__dirname, '..', 'deployment.json')
  fs.writeFileSync(outPath, JSON.stringify(deployment, null, 2))
  console.log('Deployment saved to packages/contracts/deployment.json')
  console.log('\nAdd to apps/api/.env:')
  console.log(`CONTRACT_ADDRESS="${address}"`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
