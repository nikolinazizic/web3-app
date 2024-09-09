import React, { createContext, useContext, useEffect, useState } from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

// Konfiguracija Web3Modal-a
const projectId = '1e539b78f2feb05462434af9e256df84';
const mainnet = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'SETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
};
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
};
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: '...',
  defaultChainId: 11155111
});

// Kreiranje Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true
});

// Kreiranje konteksta
const StateContext = createContext();

// Provider komponenta
export const StateContextProvider = ({ children }) => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const [web3ModalState, setWeb3ModalState] = useState({
    address,
    chainId,
    isConnected,
  });

  useEffect(() => {
    setWeb3ModalState({ address, chainId, isConnected });
  }, [address, chainId, isConnected]);

  return (
    <StateContext.Provider value={web3ModalState}>
      {children}
    </StateContext.Provider>
  );
};

// Hook za koristiti kontekstualne vrednosti
export const useStateContext = () => useContext(StateContext);
