// import { useState, useEffect } from "react";
// import { PredictionCard } from "./PredictionCard";
// import { Sparkles, Users } from "lucide-react";
// // Import your type definition
// import { Prediction } from "../types/prediction";

// // 1. Define what comes from the API (Matches your Database Schema)
// interface ApiMarket {
//   marketId: number;
//   creator: string;
//   category: string;
//   question: string;
//   media: string | null;
//   timestamp: number;
//   transactionHash: string;
//   yesPrice: number;
//   noPrice: number;
//   yesShares: number;
//   noShares: number;
//   totalVolume: number;
//   endTime: string;
// }

// interface HomeFeedProps {
//   onViewMarket: (id: string) => void;
// }

// type FeedTab = "for-you" | "following";

// export function HomeFeed({ onViewMarket }: HomeFeedProps) {
//   // 2. Start with an empty array, NOT mockPredictions
//   const [predictions, setPredictions] = useState<Prediction[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<FeedTab>("for-you");

//   // 3. Fetch Real Data on Component Mount
//   useEffect(() => {
//     const fetchMarkets = async () => {
//       try {
//         // ⚠️ Check your port! (Hono usually runs on 3000)
//         const res = await fetch("http://localhost:8000/markets");
//         const data: ApiMarket[] = await res.json();

//         // 4. Transform Raw DB Data -> The Complex "Prediction" Object
//         const formattedData: Prediction[] = data.map((market) => {
//           // console.log("market", market.yesPrice);
//           // Handle Media Fallbacks
//           const mediaStr = market.media || "";
//           const isVideo =
//             mediaStr.endsWith(".mp4") || mediaStr.endsWith(".webm");

//           let mediaUrl = mediaStr;
//           if (mediaStr.includes("ipfs")) {
//             mediaUrl = mediaStr.replace(
//               "ipfs://",
//               "https://gateway.pinata.cloud/ipfs/"
//             );
//           } else if (!mediaStr) {
//             // Fallback if no image provided
//             mediaUrl =
//               "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80";
//           }

//           console.log("market", market);
//           return {
//             id: market.marketId.toString(),

//             // 🟢 MAPPING: Create the nested 'creator' object
//             creator: {
//               name: `User ${market.creator.slice(0, 4)}`, // e.g. "User 0x4a"
//               username: `@${market.creator.slice(
//                 0,
//                 6
//               )}...${market.creator.slice(-4)}`,
//               avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${market.creator}`,
//             },

//             question: market.question,
//             category: market.category || "General",

//             // 🟢 MAPPING: Create the nested 'media' object
//             media: {
//               type: isVideo ? "video" : "image",
//               url: mediaUrl,
//               thumbnail: isVideo
//                 ? "https://placehold.co/600x400/000000/FFF?text=Video"
//                 : undefined,
//             },

//             // 🟢 MAPPING: Real Market Data
//             yesPrice: market.yesPrice ?? 0.5, // Default to 0.50 if null
//             noPrice: market.noPrice ?? 0.5,
//             totalVolume: market.totalVolume ?? 0,

//             // 🟢 MAPPING: Fill missing UI fields with defaults
//             yesShares: market.yesShares ?? 0, // You don't know the user's shares yet
//             noShares: market.noShares ?? 0,

//             createdAt: new Date(market.timestamp * 1000).toISOString(),
//             // Fake an end date (e.g. 90 days from creation)
//             endsAt: new Date(market.endTime * 1000).toISOString(),

//             // 🟢 MAPPING: Interaction stats (DB doesn't store these yet)
//             likes: 0,
//             comments: 0,
//             reposts: 0,
//             isLiked: false,
//           };
//         });

//         setPredictions(formattedData);
//       } catch (error) {
//         console.error("Failed to fetch markets:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMarkets();
//   }, []);

//   // --- (Keep your handlers below exactly as they were) ---

//   const handleLike = (id: string) => {
//     setPredictions((prev) =>
//       prev.map((p) =>
//         p.id === id
//           ? {
//               ...p,
//               isLiked: !p.isLiked,
//               likes: p.isLiked ? p.likes - 1 : p.likes + 1,
//             }
//           : p
//       )
//     );
//   };

//   const handleComment = (id: string) => console.log("Comment:", id);
//   const handleRepost = (id: string) => console.log("Repost:", id);
//   const handleBuyYes = (id: string) => console.log("Buy YES:", id);
//   const handleBuyNo = (id: string) => console.log("Buy NO:", id);

//   const getFilteredPredictions = () => {
//     if (activeTab === "following") return predictions.slice(0, 3);
//     return predictions;
//   };

//   if (loading) {
//     return (
//       <div className="w-full max-w-2xl mx-auto py-20 text-center">
//         <Sparkles className="w-10 h-10 text-[#1F87FC] animate-spin mx-auto mb-4" />
//         <p className="text-muted-foreground">Syncing with Starknet...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <Sparkles className="w-8 h-8 text-[#1F87FC]" />
//         <div>
//           <h1 className="text-foreground">Home</h1>
//           <p className="text-sm text-muted-foreground">
//             Your personalized feed
//           </p>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 border-b border-border">
//         <button
//           onClick={() => setActiveTab("for-you")}
//           className={`flex-1 pb-3 px-4 transition-all relative ${
//             activeTab === "for-you"
//               ? "text-[#1F87FC]"
//               : "text-muted-foreground hover:text-foreground"
//           }`}
//         >
//           <div className="flex items-center justify-center gap-2">
//             <Sparkles className="w-4 h-4" />
//             <span>For You</span>
//           </div>
//           {activeTab === "for-you" && (
//             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC] shadow-[0_0_8px_rgba(31,135,252,0.8)]" />
//           )}
//         </button>
//         <button
//           onClick={() => setActiveTab("following")}
//           className={`flex-1 pb-3 px-4 transition-all relative ${
//             activeTab === "following"
//               ? "text-[#1F87FC]"
//               : "text-muted-foreground hover:text-foreground"
//           }`}
//         >
//           <div className="flex items-center justify-center gap-2">
//             <Users className="w-4 h-4" />
//             <span>Following</span>
//           </div>
//           {activeTab === "following" && (
//             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC] shadow-[0_0_8px_rgba(31,135,252,0.8)]" />
//           )}
//         </button>
//       </div>

//       {/* Feed */}
//       <div className="space-y-6">
//         {getFilteredPredictions().length === 0 ? (
//           <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-12 text-center">
//             <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-foreground mb-2">No markets found</h3>
//             <p className="text-sm text-muted-foreground">
//               Go to "Create" to launch the first market!
//             </p>
//           </div>
//         ) : (
//           getFilteredPredictions().map((prediction) => (
//             <PredictionCard
//               key={prediction.id}
//               prediction={prediction}
//               onLike={handleLike}
//               onComment={handleComment}
//               onRepost={handleRepost}
//               onBuyYes={handleBuyYes}
//               onBuyNo={handleBuyNo}
//               onClick={() => onViewMarket(prediction.id)}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { PredictionCard } from "./PredictionCard";
import { Sparkles, Users } from "lucide-react";
import { Prediction } from "../types/prediction";
// 🟢 Import the Mapper (Ensure path is correct)
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";

interface HomeFeedProps {
  onViewMarket: (id: string) => void;
}

type FeedTab = "for-you" | "following";

export function HomeFeed({ onViewMarket }: HomeFeedProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        // ⚠️ Ensure port is correct (8080 or 8000)
        const res = await fetch("http://localhost:8000/markets");
        const data: ApiMarket[] = await res.json();

        // 🟢 THE FIX: Use the shared mapper
        const formattedData = data.map(mapMarketToPrediction);

        setPredictions(formattedData);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  const handleLike = (id: string) => {
    setPredictions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  // ... (Other handlers) ...
  const handleComment = (id: string) => console.log("Comment:", id);
  const handleRepost = (id: string) => console.log("Repost:", id);

  const getFilteredPredictions = () => {
    if (activeTab === "following") return predictions.slice(0, 3);
    return predictions;
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto py-20 text-center">
        <Sparkles className="w-10 h-10 text-[#1F87FC] animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Syncing with Starknet...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-[#1F87FC]" />
        <div>
          <h1 className="text-foreground">Home</h1>
          <p className="text-sm text-muted-foreground">
            Your personalized feed
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("for-you")}
          className={`flex-1 pb-3 px-4 transition-all relative ${
            activeTab === "for-you"
              ? "text-[#1F87FC]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>For You</span>
          </div>
          {activeTab === "for-you" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 pb-3 px-4 transition-all relative ${
            activeTab === "following"
              ? "text-[#1F87FC]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            <span>Following</span>
          </div>
          {activeTab === "following" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC]" />
          )}
        </button>
      </div>

      <div className="space-y-6">
        {getFilteredPredictions().length === 0 ? (
          <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-foreground mb-2">No markets found</h3>
            <p className="text-sm text-muted-foreground">
              Go to "Create" to launch the first market!
            </p>
          </div>
        ) : (
          getFilteredPredictions().map((prediction) => (
            <PredictionCard
              key={prediction.id}
              prediction={prediction}
              onLike={handleLike}
              onComment={handleComment}
              onRepost={handleRepost}
              onClick={() => onViewMarket(prediction.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
