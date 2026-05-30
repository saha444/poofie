// Web3 Browser Provider & Mock Interface for Poofie
// Dynamically hooks into browser extension (MetaMask/window.ethereum) for real signatures & addresses
// Specifically configured for Sepolia Testnet (Chain ID: 11155111 / 0xaa36a7)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Shorten address helper
export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Generate random Ethereum address (for mock fallback)
export const generateRandomAddress = () => {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * 16)];
  }
  return addr;
};

// Convert string to hex for personal_sign parameter safety
const stringToHex = (str) => {
  return '0x' + Array.from(new TextEncoder().encode(str))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Map chain IDs to human readable network names
const getNetworkName = (chainIdHex) => {
  const chainId = parseInt(chainIdHex, 16);
  switch (chainId) {
    case 1: return 'Ethereum Mainnet';
    case 11155111: return 'Sepolia Testnet';
    case 17000: return 'Holesky Testnet';
    case 137: return 'Polygon';
    case 10: return 'Optimism';
    case 42161: return 'Arbitrum One';
    case 8453: return 'Base';
    default: return `Custom EVM (ID: ${chainId})`;
  }
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
  // Check if browser has standard Web3 provider injected
  isMetaMaskInstalled: () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  },

  // Switch chain directly to Sepolia (hex: 0xaa36a7) via MetaMask RPC
  switchNetworkToSepolia: async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
        return true;
      } catch (switchError) {
        // Error code 4902 indicates that the Sepolia Test Network has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
            return true;
          } catch (addError) {
            console.error('Failed to add Sepolia network to MetaMask', addError);
            throw addError;
          }
        }
        console.error('Failed to switch to Sepolia network', switchError);
        throw switchError;
      }
    }
    return false;
  },

  // Connect wallet - prompts MetaMask if present, else simulates it
  connectWallet: async () => {
    const hasProvider = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    
    if (hasProvider) {
      // Trigger browser MetaMask prompt
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const network = getNetworkName(chainIdHex);
      
      // Fetch balance and format
      let formattedBalance = '0.00 ETH';
      try {
        const balanceHex = await window.ethereum.request({ 
          method: 'eth_getBalance', 
          params: [address, 'latest'] 
        });
        const balanceDecimal = parseInt(balanceHex, 16);
        formattedBalance = `${parseFloat(balanceDecimal / 1e18).toFixed(4)} ETH`;
      } catch (e) {
        console.error('Failed to query balance', e);
      }

      return {
        address,
        chainId: parseInt(chainIdHex, 16),
        network,
        balance: formattedBalance
      };
    } else {
      // Simulated Sepolia Testnet fallback
      await delay(1200);
      const randomAddress = generateRandomAddress();
      return {
        address: randomAddress,
        chainId: 11155111,
        network: 'Sepolia Testnet (Simulated)',
        balance: '4.895 ETH'
      };
    }
  },

  // Cryptographic Personal Signing - prompts MetaMask if present, else simulates
  personalSign: async (address, message) => {
    const hasProvider = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

    if (hasProvider) {
      // Hex-encode the signing message for standards compliance
      const hexMsg = stringToHex(message);
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [hexMsg, address]
      });

      return {
        message,
        address,
        signature,
        timestamp: Date.now()
      };
    } else {
      // Simulated signature
      await delay(1500);
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
    }
  },

  // Transaction simulation returning Sepolia Etherscan formatted details
  sendEVMTransaction: async (fromAddress, contractAddress, data) => {
    await delay(1800);
    const chars = '0123456789abcdef';
    let txHash = '0x';
    for (let i = 0; i < 64; i++) {
      txHash += chars[Math.floor(Math.random() * 16)];
    }
    return {
      txHash,
      status: 'confirmed',
      blockNumber: Math.floor(Math.random() * 50000) + 5400000, // Sepolia blocks
      gasUsed: Math.floor(Math.random() * 80000) + 21000,
      explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`
    };
  },

  // Mint verification badges NFTs on Sepolia testnet contracts
  mintVerificationBadge: async (userAddress, badgeType) => {
    await delay(2000);
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
      badgeName: badgeType === 'human' ? 'Verified Human ✅' : 'Verified Professional ⭐',
      explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`
    };
  }
};
