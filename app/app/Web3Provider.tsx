
"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const BSC_TESTNET_RPC = "https://bsc-testnet.publicnode.com"; 

// Create config outside of render to prevent multiple initializations
const config = createConfig(
  getDefaultConfig({
    chains: [bscTestnet],
    transports: {
      [bscTestnet.id]: http(BSC_TESTNET_RPC),
    },
    walletConnectProjectId: "0495f87b8979116a804369a08151214c", 
    appName: "Clawtective",
    appDescription: "Clawtective Game",
    appUrl: "https://clawtective.xyz", 
    appIcon: "https://clawtective.xyz/logo.png", 
  }),
);

// Create queryClient outside of render
const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider mode="dark">
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};