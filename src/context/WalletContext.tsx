import React, { createContext, useContext, useState, useEffect } from "react";
import { connect, disconnect } from "starknetkit";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { AccountInterface, constants } from "starknet";
import { ControllerConnector } from "@cartridge/connector";

//1. DEFINE CONNECTORS
const connectors = [
  new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
  new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
  // new WebWalletConnector({ url: "https://web.argent.xyz" }), // Uncomment for Mainnet
];

// const connectors = [
//   new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
//   new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
//   new WebWalletConnector({ url: "https://web.argent.xyz" }),

//   // 👇 UPDATED CARTRIDGE CONFIGURATION
//   new ControllerConnector({
//     rpc: "https://api.cartridge.gg/x/starknet/sepolia",
//     chains: [
//       {
//         rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
//         id: constants.NetworkName.SN_SEPOLIA,
//       },
//     ],
//     // 👇 THIS IS THE MAGIC PART YOU REMEMBERED
//     policies: [
//       {
//         target: import.meta.env.VITE_HUB_ADDRESS,
//         method: "create_market",
//         description: "Create a new prediction market",
//       },
//       // You can add more methods here later like "vote_yes" or "vote_no"
//     ],
//   }) as any,
// ];

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
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<string | undefined>(undefined);

  // 🛠️ HELPER: Aggressively find the address
  const extractAddress = (wallet: any, accountObj: any): string | undefined => {
    // 1. Check direct wallet property (Braavos/ArgentX standard)
    if (wallet?.selectedAddress) return wallet.selectedAddress;

    // 2. Check the Account object itself
    if (accountObj?.address) return accountObj.address;

    // 3. Check legacy/nested locations
    if (wallet?.account?.address) return wallet.account.address;

    return undefined;
  };

  const handleConnectionResult = async (result: any) => {
    const { wallet, connector } = result;
    console.log("🔌 Connection Result:", result);

    let finalAccount = wallet?.account;
    let finalAddress = "";

    // PATH 1: Standard Wallet Object
    if (wallet) {
      finalAddress = extractAddress(wallet, wallet.account) || "";

      // If we found an address but the account object is 'empty' (address: ''),
      // we might need to rely on the connector to give us a fresh account object.
      if (!finalAccount || !finalAccount.address) {
        if (connector) {
          try {
            finalAccount = await connector.account();
          } catch (e) {
            console.warn("Could not refresh account", e);
          }
        }
      }
    }
    // PATH 2: Connector Fallback
    else if (connector) {
      try {
        finalAccount = await connector.account();
        if (finalAccount) finalAddress = finalAccount.address;
      } catch (e) {
        console.error("❌ Connector Account Fetch Failed:", e);
      }
    }

    // UPDATE STATE
    if (finalAccount) {
      setAccount(finalAccount);
      // If the account object has the address, prefer that.
      // If not, use the one we extracted from 'selectedAddress'
      const bestAddr = finalAccount.address || finalAddress;
      setAddress(bestAddr);
      console.log("✅ Wallet Connected. Address:", bestAddr);
    }

    if (wallet?.chainId) {
      setChainId(wallet.chainId.toString());
    }
  };

  // AUTO CONNECT
  useEffect(() => {
    const tryAutoConnect = async () => {
      try {
        const result = await connect({ connectors, modalMode: "neverAsk" });
        if (result.wallet || result.connector) {
          await handleConnectionResult(result);
        }
      } catch (e) {
        console.log("Silent auto-connect pass:", e);
      }
    };
    tryAutoConnect();
  }, []);

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
    setAddress(undefined);
    setChainId(undefined);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        connectWallet,
        disconnectWallet,
        address, // 👈 Now explicitly set using our "Aggressive" logic
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
