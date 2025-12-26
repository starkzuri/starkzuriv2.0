// import { useCallback } from "react";
// import { CallData, shortString, byteArray, RpcProvider } from "starknet";
// import { toast } from "sonner";
// import { useWallet } from "../context/WalletContext";

// const PROFILE_ADDRESS = import.meta.env.VITE_PROFILE_ADDRESS;
// // 🟢 Use the same reliable node as your Create Market logic
// const ALCHEMY_URL =
//   "import.meta.env.VITE_NODE_URL";

// export const useProfile = () => {
//   const { account } = useWallet();

//   const updateProfile = useCallback(
//     async (
//       username: string,
//       displayName: string,
//       bio: string,
//       avatarUrl: string,
//       referrer: string = "0x0"
//     ) => {
//       if (!account || !PROFILE_ADDRESS) {
//         toast.error("Wallet not connected");
//         return;
//       }

//       try {
//         toast.loading("Preparing reliable transaction...");

//         // 🟢 1. SETUP RELIABLE PROVIDER (The "Patch")
//         // This ensures we don't get random wallet RPC errors
//         const alchemyProvider = new RpcProvider({ nodeUrl: ALCHEMY_URL });
//         (account as any).provider = alchemyProvider;

//         // 🟢 2. DATA PREP (Manual & Precise)

//         // A. Username (Felt252)
//         const cleanUsername = username.replace("@", "").substring(0, 30);
//         let usernameFelt;
//         try {
//           usernameFelt = shortString.encodeShortString(cleanUsername);
//         } catch (e) {
//           toast.dismiss();
//           toast.error("Username invalid (use simple characters)");
//           return;
//         }

//         // B. ByteArrays (Using the correct function you pointed out!)
//         const displayBytes = byteArray.byteArrayFromString(displayName);
//         const bioBytes = byteArray.byteArrayFromString(bio);
//         const avatarBytes = byteArray.byteArrayFromString(avatarUrl);

//         // 🟢 3. COMPILE CALLDATA MANUALLY
//         // No ABI needed, we compile the raw inputs exactly as the contract expects
//         const myCall = {
//           contractAddress: PROFILE_ADDRESS,
//           entrypoint: "set_profile",
//           calldata: CallData.compile([
//             usernameFelt, // username
//             displayBytes, // display_name
//             bioBytes, // bio
//             avatarBytes, // avatar_uri
//             referrer, // referrer
//           ]),
//         };

//         console.log("🚀 Sending Reliable Profile Update...", myCall);

//         // 🟢 4. EXECUTE
//         const { transaction_hash } = await account.execute([myCall]);

//         console.log("✅ Tx Hash:", transaction_hash);
//         toast.dismiss();
//         toast.success("Transaction Sent!");

//         // Clean up
//         localStorage.removeItem("starkzuri_referrer");

//         return transaction_hash;
//       } catch (error: any) {
//         console.error("❌ Profile Update Failed:", error);
//         toast.dismiss();

//         // User rejection check
//         const msg = error.message.includes("User rejected")
//           ? "Transaction rejected by user"
//           : "Update failed. See console.";
//         toast.error(msg);
//       }
//     },
//     [account]
//   );

//   return { updateProfile };
// };

import { useCallback } from "react";
import { CallData, shortString, byteArray, RpcProvider } from "starknet";
import { toast } from "sonner";
import { useWallet } from "../context/WalletContext";

const PROFILE_ADDRESS = import.meta.env.VITE_PROFILE_ADDRESS;
// Use your reliable RPC
const ALCHEMY_URL = "import.meta.env.VITE_NODE_URL";

export const useProfile = () => {
  const { account } = useWallet();

  const updateProfile = useCallback(
    async (
      username: string,
      displayName: string,
      bio: string,
      avatarUrl: string,
      referrer: string | null // 🟢 Allow null
    ) => {
      if (!account || !PROFILE_ADDRESS) {
        toast.error("Wallet or Contract missing");
        return;
      }

      try {
        toast.loading("Updating Profile...");

        // 1. Provider Patch (Reliable RPC)
        const alchemyProvider = new RpcProvider({ nodeUrl: ALCHEMY_URL });
        (account as any).provider = alchemyProvider;

        // 2. Data Prep
        // A. Username (Felt)
        const cleanName = username.replace("@", "").substring(0, 30);
        const usernameFelt = shortString.encodeShortString(cleanName);

        // B. ByteArrays (Strings)
        // Ensure we handle empty strings correctly
        const displayBytes = byteArray.byteArrayFromString(displayName || "");
        const bioBytes = byteArray.byteArrayFromString(bio || "");
        const avatarBytes = byteArray.byteArrayFromString(avatarUrl || "");

        // C. Referrer (Address)
        // If null/empty/undefined, use "0" (as integer string) or "0x0"
        const validReferrer =
          referrer && referrer.startsWith("0x") ? referrer : "0x0";

        // 3. Compile Calldata (Strict Order)
        const myCall = {
          contractAddress: PROFILE_ADDRESS,
          entrypoint: "set_profile",
          calldata: CallData.compile([
            usernameFelt, // 1. username (felt252)
            displayBytes, // 2. display_name (ByteArray)
            bioBytes, // 3. bio (ByteArray)
            avatarBytes, // 4. avatar_uri (ByteArray)
            validReferrer, // 5. referrer (ContractAddress)
          ]),
        };

        console.log("🚀 Payload:", myCall);

        // 4. Execute
        const { transaction_hash } = await account.execute([myCall]);

        console.log("✅ Hash:", transaction_hash);
        toast.dismiss();
        toast.success("Sent! Waiting for Indexer...");

        localStorage.removeItem("starkzuri_referrer");
        return transaction_hash;
      } catch (error: any) {
        console.error("❌ Error:", error);
        toast.dismiss();
        toast.error("Update failed: " + error.message);
      }
    },
    [account]
  );

  return { updateProfile };
};
