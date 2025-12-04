const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
];

export const getIPFSUrl = (cid: string): string => {
  return `${IPFS_GATEWAYS[0]}${cid}`;
};

export const testIPFSGateway = async (cid: string): Promise<string | null> => {
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${cid}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { 
        method: 'HEAD', 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return url;
      }
    } catch (error) {
      console.warn(`Gateway ${gateway} failed:`, error);
    }
  }

  return null;
};

export const getWorkingGateway = async (cid: string): Promise<string> => {
  const workingUrl = await testIPFSGateway(cid);
  return workingUrl || getIPFSUrl(cid);
};
