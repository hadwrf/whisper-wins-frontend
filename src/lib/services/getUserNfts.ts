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
  description: string;
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
      }[];
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

export interface NftRequest {
  contractAddress: string;
  tokenId: string;
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
export async function getUserNfts(owner: string, withMetadata: boolean = true): Promise<GetUserNftsResponse> {
  const url = `${API_BASE_URL}/${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${owner}&withMetadata=${withMetadata}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch NFTs for a specific owner.
 * @param nftRequest - The wallet address of the owner.
 * @returns Promise<Nft>
 */
export async function getNft(nftRequest: NftRequest): Promise<Nft> {
  const url = new URL(`${API_BASE_URL}/${ALCHEMY_API_KEY}/getNFTMetadata`);
  url.searchParams.append('contractAddress', nftRequest.contractAddress);
  url.searchParams.append('tokenId', nftRequest.tokenId);
  url.searchParams.append('refreshCache', 'false');

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch NFT: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch Auction NFTs for a specific owner.
 * @param nftRequests - NFT request data as an array
 * @returns Promise<Nft[]>
 */
export async function getUserAuctionNFTs(nftRequests: NftRequest[]): Promise<Nft[]> {
  const url = `${API_BASE_URL}/${ALCHEMY_API_KEY}/getNFTMetadataBatch`;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      tokens: nftRequests,
      refreshCache: false,
    }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
  }
  return await response.json();
}
