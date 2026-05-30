// IPFS Mock Interface for Poofie
// Simulates decentralized file storage uploading, pins files, and generates mock Content Identifiers (CIDs)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const ipfsMock = {
  // Simulate uploading a file/media/document to IPFS
  uploadFile: async (fileObject) => {
    await delay(1800); // realistic latency for small network upload

    // Determine mock CID based on file name or random hash
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; // Base58 characters
    let cid = 'Qm';
    for (let i = 0; i < 44; i++) {
      cid += chars[Math.floor(Math.random() * chars.length)];
    }

    const fileSize = fileObject ? (fileObject.size || Math.floor(Math.random() * 1024 * 1024) + 12000) : 15000;
    const formattedSize = (fileSize / 1024).toFixed(2) + ' KB';

    return {
      success: true,
      cid,
      size: formattedSize,
      gatewayUrl: `https://ipfs.io/ipfs/${cid}`,
      pinStatus: 'pinned',
      timestamp: Date.now()
    };
  },

  // Simulate uploading post metadata JSON (structured data)
  uploadMetadata: async (metadataJSON) => {
    await delay(1200); // metadata is lightweight, uploaded fast

    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let cid = 'bafybeic';
    for (let i = 0; i < 38; i++) {
      cid += chars[Math.floor(Math.random() * chars.length)].toLowerCase();
    }

    return {
      success: true,
      cid,
      gatewayUrl: `https://ipfs.io/ipfs/${cid}`,
      timestamp: Date.now()
    };
  }
};
