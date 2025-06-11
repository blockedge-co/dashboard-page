// Blockchain explorer utilities for opening contracts and transactions

export interface BlockchainConfig {
  name: string;
  baseUrl: string;
  tokenPath: string;
  addressPath: string;
  transactionPath: string;
}

// Blockchain explorer configurations
export const BLOCKCHAIN_EXPLORERS: Record<string, BlockchainConfig> = {
  co2e: {
    name: "CO2e Chain Explorer",
    baseUrl: "https://exp.co2e.cc",
    tokenPath: "/token",
    addressPath: "/address",
    transactionPath: "/tx",
  },
  ethereum: {
    name: "Etherscan",
    baseUrl: "https://etherscan.io",
    tokenPath: "/token",
    addressPath: "/address",
    transactionPath: "/tx",
  },
  polygon: {
    name: "PolygonScan",
    baseUrl: "https://polygonscan.com",
    tokenPath: "/token",
    addressPath: "/address",
    transactionPath: "/tx",
  },
  bsc: {
    name: "BscScan",
    baseUrl: "https://bscscan.com",
    tokenPath: "/token",
    addressPath: "/address",
    transactionPath: "/tx",
  },
  arbitrum: {
    name: "Arbiscan",
    baseUrl: "https://arbiscan.io",
    tokenPath: "/token",
    addressPath: "/address",
    transactionPath: "/tx",
  },
  optimism: {
    name: "Optimistic Etherscan",
    baseUrl: "https://optimistic.etherscan.io",
    tokenPath: "/token",
    addressPath: "/address",
    transactionPath: "/tx",
  },
};

// Default to CO2e Chain explorer
export const DEFAULT_EXPLORER = BLOCKCHAIN_EXPLORERS.co2e;

/**
 * Determine blockchain network from contract address patterns
 */
export function detectBlockchainNetwork(address: string): BlockchainConfig {
  // For BlockEdge projects, default to CO2e Chain explorer
  // This is the primary blockchain for carbon credit tokenization
  
  if (!address || !isValidAddress(address)) {
    return DEFAULT_EXPLORER;
  }

  // Default to CO2e Chain for all carbon credit tokens
  // BlockEdge carbon credits are primarily on CO2e Chain
  return DEFAULT_EXPLORER;
}

/**
 * Validate if address is a valid Ethereum-style address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Open token contract in blockchain explorer
 */
export function openTokenInExplorer(
  tokenAddress: string,
  blockchain?: string
): void {
  if (!tokenAddress || !isValidAddress(tokenAddress)) {
    console.error("Invalid token address:", tokenAddress);
    return;
  }

  const explorer = blockchain
    ? BLOCKCHAIN_EXPLORERS[blockchain]
    : detectBlockchainNetwork(tokenAddress);
  const url = `${explorer.baseUrl}${explorer.tokenPath}/${tokenAddress}`;

  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Failed to open blockchain explorer:", error);
    // Fallback: copy URL to clipboard
    navigator.clipboard.writeText(url).then(() => {
      console.log("Explorer URL copied to clipboard:", url);
    });
  }
}

/**
 * Open address in blockchain explorer
 */
export function openAddressInExplorer(
  address: string,
  blockchain?: string
): void {
  if (!address || !isValidAddress(address)) {
    console.error("Invalid address:", address);
    return;
  }

  const explorer = blockchain
    ? BLOCKCHAIN_EXPLORERS[blockchain]
    : detectBlockchainNetwork(address);
  const url = `${explorer.baseUrl}${explorer.addressPath}/${address}`;

  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Failed to open blockchain explorer:", error);
    // Fallback: copy URL to clipboard
    navigator.clipboard.writeText(url).then(() => {
      console.log("Explorer URL copied to clipboard:", url);
    });
  }
}

/**
 * Open transaction in blockchain explorer
 */
export function openTransactionInExplorer(
  txHash: string,
  blockchain?: string
): void {
  if (!txHash || !isValidTxHash(txHash)) {
    console.error("Invalid transaction hash:", txHash);
    return;
  }

  const explorer = blockchain
    ? BLOCKCHAIN_EXPLORERS[blockchain]
    : DEFAULT_EXPLORER;
  const url = `${explorer.baseUrl}${explorer.transactionPath}/${txHash}`;

  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Failed to open blockchain explorer:", error);
    // Fallback: copy URL to clipboard
    navigator.clipboard.writeText(url).then(() => {
      console.log("Explorer URL copied to clipboard:", url);
    });
  }
}

/**
 * Validate if string is a valid transaction hash
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Get explorer name for display
 */
export function getExplorerName(address: string, blockchain?: string): string {
  const explorer = blockchain
    ? BLOCKCHAIN_EXPLORERS[blockchain]
    : detectBlockchainNetwork(address);
  return explorer.name;
}

/**
 * Get full explorer URL for a token
 */
export function getTokenExplorerUrl(
  tokenAddress: string,
  blockchain?: string
): string {
  if (!tokenAddress || !isValidAddress(tokenAddress)) {
    return "";
  }

  const explorer = blockchain
    ? BLOCKCHAIN_EXPLORERS[blockchain]
    : detectBlockchainNetwork(tokenAddress);
  return `${explorer.baseUrl}${explorer.tokenPath}/${tokenAddress}`;
}

/**
 * Handle blockchain viewing for carbon credit projects
 */
export function viewTokenOnBlockchain(project: any): void {
  if (!project) {
    console.error("No project provided");
    return;
  }

  // Try token address first (preferred)
  if (project.tokenAddress && isValidAddress(project.tokenAddress)) {
    console.log(
      `Opening CO2e Chain explorer for ${project.name}:`,
      project.tokenAddress
    );
    // Use CO2e Chain explorer specifically
    openTokenInExplorer(project.tokenAddress, 'co2e');
    return;
  }

  // Try legacy token field (for BlockEdge API format)
  if (project.token && isValidAddress(project.token)) {
    console.log(
      `Opening CO2e Chain explorer for token ${project.name}:`,
      project.token
    );
    openTokenInExplorer(project.token, 'co2e');
    return;
  }

  // No valid address found
  console.warn("No valid blockchain address found for project:", project.name);

  // Show user-friendly message
  if (typeof window !== "undefined") {
    alert('Blockchain information not available for this project. Please check if the project has been tokenized on CO2e Chain.');
  }
}
export function viewCertOnBlockchain(project: any): void {
  if (!project) {
    console.error("No project provided");
    return;
  }



  // Try certificate address as fallback
  if (project.certContract && isValidAddress(project.certContract)) {
    console.log(
      `Opening CO2e Chain explorer for certificate ${project.name}:`,
      project.cert
    );
    // Use CO2e Chain explorer specifically
    openTokenInExplorer(project.certContract, 'co2e');
    return;
  }

  // Try legacy token field (for BlockEdge API format)
  if (project.token && isValidAddress(project.token)) {
    console.log(
      `Opening CO2e Chain explorer for token ${project.name}:`,
      project.token
    );
    openTokenInExplorer(project.token, 'co2e');
    return;
  }

  // No valid address found
  console.warn("No valid blockchain address found for project:", project.name);

  // Show user-friendly message
  if (typeof window !== "undefined") {
    alert('Blockchain information not available for this project. Please check if the project has been tokenized on CO2e Chain.');
  }
}
