// Web3 Mock Interface for Poofie
// Simulates MetaMask wallet connection, gas transactions, personal sign, and ERC-721 badge minting

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Shorten address helper
export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Generate random Ethereum address
export const generateRandomAddress = () => {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * 16)];
  }
  return addr;
};

// Seed initial system-verified professional profiles
export const MOCK_SYSTEM_USERS = [
  {
    address: '0x32A7d1d2bC39E92d192B45f448e895B309fD13c0',
    name: 'Alice Vance',
    username: 'alice_v',
    bio: 'Lead Smart Contract Engineer @ Optimism | Solidity Auditor & Educator. Building the future of Web3 identity.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    skills: ['Solidity', 'Smart Contracts', 'Auditing', 'Ethereum', 'DeFi'],
    portfolio: { github: 'https://github.com/alicev', website: 'https://alicevance.io' },
    badges: { verifiedHuman: true, verifiedProfessional: true },
    poofieScore: 92,
    poofieXP: 8200,
    level: 12,
    ratingStreak: 5,
    interests: ['DeFi', 'Smart Contracts', 'DAOs'],
    contentScore: 42,
    reputationScore: 50,
  },
  {
    address: '0x8F94D2554794e537D71C80e1A467DE72aCc3C279',
    name: 'Marcus K.',
    username: 'marcus_design',
    bio: 'UX/UI Designer specializing in Web3, dApps & spatial interfaces. Ex-ConsenSys, ex-Uniswap.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    skills: ['UI/UX Design', 'Figma', 'Prototyping', 'Web3 Design', 'Front-End'],
    portfolio: { dribbble: 'https://dribbble.com/marcus', website: 'https://marcusk.design' },
    badges: { verifiedHuman: true, verifiedProfessional: true },
    poofieScore: 88,
    poofieXP: 6400,
    level: 9,
    ratingStreak: 3,
    interests: ['UI/UX', 'NFTs', 'Web3 Design'],
    contentScore: 40,
    reputationScore: 48,
  },
  {
    address: '0xBC78e3C9C29A6b4EF504C0dBbB77D2fA35eEd406',
    name: 'Elena Rostova',
    username: 'elena_dev',
    bio: 'Fullstack Dev & Crypto-Research Fellow. Writing about zero-knowledge proofs and decentralized reputation frameworks.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    skills: ['React', 'Cryptography', 'NextJS', 'ZK-Proofs', 'TypeScript'],
    portfolio: { github: 'https://github.com/elenarostova', linkedin: 'https://linkedin.com/in/elena' },
    badges: { verifiedHuman: true, verifiedProfessional: true },
    poofieScore: 78,
    poofieXP: 4900,
    level: 7,
    ratingStreak: 0,
    interests: ['Cryptography', 'Privacy', 'ZK-Proofs'],
    contentScore: 38,
    reputationScore: 40,
  },
  {
    address: '0xE2e5A4E83bBDDe8c1E4f4544d0E7dF0FfF15456f',
    name: 'Devon Carter',
    username: 'devon_c',
    bio: 'Content Lead & Technical Writer. Explaining complex Ethereum architectures simply. Ex-CoinDesk contributor.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    skills: ['Technical Writing', 'SEO', 'Ethereum', 'DeFi', 'Marketing'],
    portfolio: { website: 'https://devoncarter.xyz', linkedin: 'https://linkedin.com/in/devon' },
    badges: { verifiedHuman: true, verifiedProfessional: true },
    poofieScore: 84,
    poofieXP: 5800,
    level: 8,
    ratingStreak: 4,
    interests: ['Ethereum', 'Content Creation', 'DAOs'],
    contentScore: 44,
    reputationScore: 40,
  }
];

export const web3Mock = {
  // Simulate checking if metamask is installed
  isMetaMaskInstalled: () => {
    return true;
  },

  // Simulate wallet connection
  connectWallet: async () => {
    await delay(1200); // realistic latency
    const randomAddress = generateRandomAddress();
    return {
      address: randomAddress,
      chainId: 1, // Ethereum Mainnet
      network: 'Ethereum Mainnet',
      balance: '1.485 ETH'
    };
  },

  // Simulate signing a personal message to prove ownership
  personalSign: async (address, message) => {
    await delay(1500); // user "approving" in MetaMask
    // Generate a mock signature
    const chars = '0123456789abcdef';
    let signature = '0x';
    for (let i = 0; i < 130; i++) {
      signature += chars[Math.floor(Math.random() * 16)];
    }
    return {
      message,
      address,
      signature,
      timestamp: Date.now()
    };
  },

  // Simulate on-chain transaction execution for rating, posting, or verifying
  sendEVMTransaction: async (fromAddress, contractAddress, data) => {
    await delay(2000); // block mining time simulator
    const chars = '0123456789abcdef';
    let txHash = '0x';
    for (let i = 0; i < 64; i++) {
      txHash += chars[Math.floor(Math.random() * 16)];
    }
    return {
      txHash,
      status: 'confirmed',
      blockNumber: Math.floor(Math.random() * 50000) + 17000000,
      gasUsed: Math.floor(Math.random() * 80000) + 21000
    };
  },

  // Simulate smart contract minting of Verification NFTs
  mintVerificationBadge: async (userAddress, badgeType) => {
    await delay(2200); // minting delay
    const chars = '0123456789abcdef';
    let nftTokenId = '';
    for (let i = 0; i < 8; i++) {
      nftTokenId += chars[Math.floor(Math.random() * 16)];
    }
    let txHash = '0x';
    for (let i = 0; i < 64; i++) {
      txHash += chars[Math.floor(Math.random() * 16)];
    }
    
    return {
      success: true,
      tokenId: nftTokenId,
      contractAddress: badgeType === 'human' 
        ? '0x7940e4f49e4d1f2e8c201df1eef00035feed406b' 
        : '0x8f9e0a1dd72d4c0b45fae8e895b309fd13c0ee72',
      txHash,
      badgeName: badgeType === 'human' ? 'Verified Human ✅' : 'Verified Professional ⭐'
    };
  }
};
