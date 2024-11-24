export interface Nft {
  contract: {
    address: string;
    name: string;
    symbol: string;
    tokenType: string;
  };
  tokenId: string;
  tokenType: string;
  name: string;
  desctiption: string;
  tokenUri: string;
  image: {
    originalUrl: string;
  };
  raw: {
    tokenUri: string;
    metadata: {
      name: string;
      description: string;
      image: string;
      attributes: {
        trait_type: string;
        value: string;
      };
    };
  };
  mint: {
    mintAddress: string;
    blockNumber: number;
    timeStamp: string;
    transactionHash: string;
  };
  timeLastUpdated: string;
}

export interface GetUserNftsResponse {
  ownedNfts: Nft[];
  totalCount: number;
  pageKey?: string;
}

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const API_BASE_URL = 'https://eth-sepolia.g.alchemy.com/nft/v3';

/**
 * Fetch NFTs for a specific owner.
 * @param owner - The wallet address of the owner.
 * @param withMetadata - Whether to include metadata in the response.
 * @returns Promise<GetNftsResponse>
 */
export async function getUserNfts(owner: string | null, withMetadata: boolean = true): Promise<GetUserNftsResponse> {
  const url = `${API_BASE_URL}/${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${owner}&withMetadata=${withMetadata}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
    }

    const data: GetUserNftsResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
