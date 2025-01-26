import { suaveToliman as suaveChain } from '@flashbots/suave-viem/chains';
import { createPublicClient, http } from '@flashbots/suave-viem';

export const SUAVE = 'https://rpc.toliman.suave.flashbots.net';

export const getPublicClient = () => {
  return createPublicClient({
    chain: {
      ...suaveChain,
      networkName: suaveChain.name,
      chainId: suaveChain.id,
      currencySymbol: suaveChain.nativeCurrency.symbol,
    },
    transport: http(SUAVE),
  });
};

export const KETTLE_ADDRESS = '0xf579de142d98f8379c54105ac944fe133b7a17fe';
