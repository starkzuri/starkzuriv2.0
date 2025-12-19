import React, { createContext, useContext, useState, useEffect } from "react";
import { connect, disconnect } from "starknetkit";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { ControllerConnector } from "@cartridge/connector";
import { AccountInterface, constants } from "starknet";

// 1. DEFINE CONNECTORS (Outside component to prevent re-renders)
const connectors = [
  new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
  new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
  new WebWalletConnector({ url: "https://web.argent.xyz" }),
  new ControllerConnector({
    rpc: "https://api.cartridge.gg/x/starknet/sepolia",
    chains: [
      {
        rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
        id: constants.NetworkName.SN_SEPOLIA,
      },
    ],
  }) as any,
];

interface WalletContextType {
  account: AccountInterface | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  address: string | undefined;
  chainId: string | undefined;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [chainId, setChainId] = useState<string | undefined>(undefined);

  // UNIVERSAL HANDLER: Extracts account from ANY structure
  const handleConnectionResult = async (result: any) => {
    const { wallet, connector, connectorData } = result;

    console.log("🔌 Processing Connection Result:", result);

    // PATH 1: Standard 'wallet' object (Braavos/Argent usually land here)
    if (wallet && wallet.account) {
      console.log("✅ Found Wallet Object");
      setAccount(wallet.account);
      setChainId(wallet.chainId);
      return;
    }

    // PATH 2: Connector Fallback (Cartridge lands here!)
    // If 'wallet' is null, we ask the connector directly for the account.
    if (connector) {
      console.log("⚠️ Wallet object missing. Trying connector directly...");
      try {
        const accountObj = await connector.account();
        if (accountObj) {
          console.log(
            "✅ Recovered Account from Connector:",
            accountObj.address
          );
          setAccount(accountObj);

          // Try to set chainId if available in data
          if (connectorData && connectorData.chainId) {
            setChainId(connectorData.chainId.toString());
          }
          return;
        }
      } catch (e) {
        console.error("❌ Failed to get account from connector:", e);
      }
    }
  };

  // 1. AUTO-CONNECT
  useEffect(() => {
    const tryAutoConnect = async () => {
      try {
        const result = await connect({
          connectors,
          modalMode: "neverAsk",
        });

        // Only process if we actually found a connection
        if (result.wallet || result.connector) {
          await handleConnectionResult(result);
        }
      } catch (e) {
        console.log("Silent auto-connect pass:", e);
      }
    };
    tryAutoConnect();
  }, []);

  // 2. MANUAL CONNECT
  const connectWallet = async () => {
    try {
      const result = await connect({
        connectors,
        modalMode: "alwaysAsk",
        argentMobileOptions: {
          dappName: "StarkZuri",
          chainId: constants.NetworkName.SN_SEPOLIA,
        },
      });

      await handleConnectionResult(result);
    } catch (e) {
      console.error("Connection Error:", e);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    setAccount(null);
    setChainId(undefined);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        connectWallet,
        disconnectWallet,
        address: account?.address,
        chainId,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context)
    throw new Error("useWallet must be used within a WalletProvider");
  return context;
};
