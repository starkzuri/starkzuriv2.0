// import { useState } from "react";
// import { TrendingUp, TrendingDown, Sparkles, Search, X } from "lucide-react";
// import { mockPredictions } from "../data/mockData";
// import { PredictionCard } from "./PredictionCard";

// type MarketView = "all" | "trending" | "rising-yes" | "rising-no" | "new";

// interface MarketExploreProps {
//   onViewMarket: (id: string) => void;
// }

// export function MarketExplore({ onViewMarket }: MarketExploreProps) {
//   const [activeView, setActiveView] = useState<MarketView>("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");

//   const categories = ["all", "Crypto", "Tech", "Sports", "Space", "Politics"];

//   const filteredPredictions = () => {
//     let filtered = [...mockPredictions];

//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         (p) =>
//           p.question.toLowerCase().includes(query) ||
//           p.creator.name.toLowerCase().includes(query) ||
//           p.creator.username.toLowerCase().includes(query) ||
//           p.category.toLowerCase().includes(query)
//       );
//     }

//     // Apply category filter
//     if (selectedCategory !== "all") {
//       filtered = filtered.filter((p) => p.category === selectedCategory);
//     }

//     // Apply view filter
//     switch (activeView) {
//       case "trending":
//         return filtered.sort((a, b) => b.totalVolume - a.totalVolume);
//       case "rising-yes":
//         return filtered.sort((a, b) => b.yesPrice - a.yesPrice);
//       case "rising-no":
//         return filtered.sort((a, b) => b.noPrice - a.noPrice);
//       case "new":
//         return filtered.sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
//       default:
//         return filtered;
//     }
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[#1F87FC]" />
//         <div>
//           <h1 className="text-foreground text-xl md:text-2xl">
//             Explore Markets
//           </h1>
//           <p className="text-xs md:text-sm text-muted-foreground">
//             Discover and trade predictions
//           </p>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative">
//         <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search predictions, creators..."
//           className="w-full bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg md:rounded-xl pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#1F87FC] focus:ring-1 focus:ring-[#1F87FC] transition-all"
//         />
//         {searchQuery && (
//           <button
//             onClick={clearSearch}
//             className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
//           >
//             <X className="w-4 h-4 md:w-5 md:h-5" />
//           </button>
//         )}
//       </div>

//       {/* Category Filter */}
//       <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => setSelectedCategory(category)}
//             className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
//               selectedCategory === category
//                 ? "bg-[#1F87FC] text-white shadow-[0_0_15px_rgba(31,135,252,0.5)]"
//                 : "bg-[#0f0f1a] border border-[#1F87FC]/30 text-muted-foreground hover:border-[#1F87FC]/60 hover:text-foreground"
//             }`}
//           >
//             {category === "all" ? "All" : category}
//           </button>
//         ))}
//       </div>

//       {/* View Filters */}
//       <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
//         <button
//           onClick={() => setActiveView("all")}
//           className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
//             activeView === "all"
//               ? "bg-[#1F87FC]/20 border-2 border-[#1F87FC] text-[#1F87FC]"
//               : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#1F87FC]/40"
//           }`}
//         >
//           <Sparkles className="w-4 h-4" />
//           <span className="text-xs md:text-sm">All</span>
//         </button>

//         <button
//           onClick={() => setActiveView("trending")}
//           className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
//             activeView === "trending"
//               ? "bg-[#1F87FC]/20 border-2 border-[#1F87FC] text-[#1F87FC]"
//               : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#1F87FC]/40"
//           }`}
//         >
//           <TrendingUp className="w-4 h-4" />
//           <span className="text-xs md:text-sm">Hot</span>
//         </button>

//         <button
//           onClick={() => setActiveView("rising-yes")}
//           className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
//             activeView === "rising-yes"
//               ? "bg-[#00ff88]/20 border-2 border-[#00ff88] text-[#00ff88]"
//               : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#00ff88]/40"
//           }`}
//         >
//           <TrendingUp className="w-4 h-4" />
//           <span className="text-xs md:text-sm">YES</span>
//         </button>

//         <button
//           onClick={() => setActiveView("rising-no")}
//           className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
//             activeView === "rising-no"
//               ? "bg-[#ff3366]/20 border-2 border-[#ff3366] text-[#ff3366]"
//               : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#ff3366]/40"
//           }`}
//         >
//           <TrendingDown className="w-4 h-4" />
//           <span className="text-xs md:text-sm">NO</span>
//         </button>

//         <button
//           onClick={() => setActiveView("new")}
//           className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
//             activeView === "new"
//               ? "bg-[#1F87FC]/20 border-2 border-[#1F87FC] text-[#1F87FC]"
//               : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#1F87FC]/40"
//           }`}
//         >
//           <Sparkles className="w-4 h-4" />
//           <span className="text-xs md:text-sm">New</span>
//         </button>
//       </div>

//       {/* Results Count */}
//       {(searchQuery || selectedCategory !== "all") && (
//         <div className="flex items-center justify-between text-xs md:text-sm">
//           <span className="text-muted-foreground">
//             {filteredPredictions().length}{" "}
//             {filteredPredictions().length === 1 ? "result" : "results"}
//           </span>
//           {(searchQuery || selectedCategory !== "all") && (
//             <button
//               onClick={() => {
//                 setSearchQuery("");
//                 setSelectedCategory("all");
//               }}
//               className="text-[#1F87FC] hover:text-[#1F87FC]/80 transition-colors"
//             >
//               Clear filters
//             </button>
//           )}
//         </div>
//       )}

//       {/* Predictions Feed */}
//       <div className="space-y-4 md:space-y-6">
//         {filteredPredictions().length === 0 ? (
//           <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-8 md:p-12 text-center">
//             <Search className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
//             <h3 className="text-foreground mb-2 text-sm md:text-base">
//               No predictions found
//             </h3>
//             <p className="text-xs md:text-sm text-muted-foreground">
//               Try adjusting your search or filters
//             </p>
//           </div>
//         ) : (
//           filteredPredictions().map((prediction) => (
//             <PredictionCard
//               key={prediction.id}
//               prediction={prediction}
//               onClick={onViewMarket}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown, Sparkles, Search, X } from "lucide-react";
import { PredictionCard } from "./PredictionCard";
// 🟢 Import shared type
import { Prediction } from "../types/prediction";

// 1. Define API Interface (Same as HomeFeed)
interface ApiMarket {
  marketId: number;
  creator: string;
  category: string;
  question: string;
  media: string | null;
  timestamp: number;
  transactionHash: string;
  yesPrice: number;
  noPrice: number;
  yesShares: number;
  noShares: number;
  totalVolume: number;
  endTime: number;
}

type MarketView = "all" | "trending" | "rising-yes" | "rising-no" | "new";

interface MarketExploreProps {
  onViewMarket: (id: string) => void;
}

export function MarketExplore({ onViewMarket }: MarketExploreProps) {
  // 2. State for Real Data
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. State for UI Filters
  const [activeView, setActiveView] = useState<MarketView>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Crypto", "Tech", "Sports", "Space", "Politics"];

  // 4. FETCH REAL DATA (Aligned with HomeFeed)
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        // ⚠️ Ensure port matches your Indexer API (8080 or 8000)
        const res = await fetch("http://localhost:8000/markets");
        const data: ApiMarket[] = await res.json();

        const formattedData: Prediction[] = data.map((market) => {
          // Media Fallback Logic
          const mediaStr = market.media || "";
          const isVideo =
            mediaStr.endsWith(".mp4") || mediaStr.endsWith(".webm");
          let mediaUrl = mediaStr;
          if (mediaStr.includes("ipfs")) {
            mediaUrl = mediaStr.replace(
              "ipfs://",
              "https://gateway.pinata.cloud/ipfs/"
            );
          } else if (!mediaStr) {
            mediaUrl =
              "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80";
          }

          return {
            id: market.marketId.toString(),
            creator: {
              name: `User ${market.creator.slice(0, 4)}`,
              username: `@${market.creator.slice(
                0,
                6
              )}...${market.creator.slice(-4)}`,
              avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${market.creator}`,
            },
            question: market.question,
            category: market.category || "General",
            media: {
              type: isVideo ? "video" : "image",
              url: mediaUrl,
              thumbnail: isVideo
                ? "https://placehold.co/600x400/000000/FFF?text=Video"
                : undefined,
            },
            yesPrice: market.yesPrice ?? 0.5,
            noPrice: market.noPrice ?? 0.5,
            totalVolume: market.totalVolume ?? 0,
            yesShares: 0,
            noShares: 0,
            createdAt: new Date(market.timestamp * 1000).toISOString(),
            endsAt: new Date(market.endTime * 1000).toISOString(),
            likes: 0,
            comments: 0,
            reposts: 0,
            isLiked: false,
          };
        });

        setPredictions(formattedData);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  // 5. FILTERING LOGIC (Applied to Real Data)
  const filteredPredictions = useMemo(() => {
    let filtered = [...predictions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.question.toLowerCase().includes(query) ||
          p.creator.name.toLowerCase().includes(query) ||
          p.creator.username.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply view filter
    switch (activeView) {
      case "trending":
        return filtered.sort((a, b) => b.totalVolume - a.totalVolume);
      case "rising-yes":
        return filtered.sort((a, b) => b.yesPrice - a.yesPrice);
      case "rising-no":
        return filtered.sort((a, b) => b.noPrice - a.noPrice);
      case "new":
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return filtered;
    }
  }, [predictions, searchQuery, selectedCategory, activeView]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  // 6. LOADING STATE
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 text-center">
        <Sparkles className="w-10 h-10 text-[#1F87FC] animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading markets...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[#1F87FC]" />
        <div>
          <h1 className="text-foreground text-xl md:text-2xl">
            Explore Markets
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Discover and trade predictions
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search predictions, creators..."
          className="w-full bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg md:rounded-xl pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#1F87FC] focus:ring-1 focus:ring-[#1F87FC] transition-all"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategory === category
                ? "bg-[#1F87FC] text-white shadow-[0_0_15px_rgba(31,135,252,0.5)]"
                : "bg-[#0f0f1a] border border-[#1F87FC]/30 text-muted-foreground hover:border-[#1F87FC]/60 hover:text-foreground"
            }`}
          >
            {category === "all" ? "All" : category}
          </button>
        ))}
      </div>

      {/* View Filters */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
        <button
          onClick={() => setActiveView("all")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "all"
              ? "bg-[#1F87FC]/20 border-2 border-[#1F87FC] text-[#1F87FC]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#1F87FC]/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs md:text-sm">All</span>
        </button>

        <button
          onClick={() => setActiveView("trending")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "trending"
              ? "bg-[#1F87FC]/20 border-2 border-[#1F87FC] text-[#1F87FC]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#1F87FC]/40"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs md:text-sm">Hot</span>
        </button>

        <button
          onClick={() => setActiveView("rising-yes")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "rising-yes"
              ? "bg-[#00ff88]/20 border-2 border-[#00ff88] text-[#00ff88]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#00ff88]/40"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs md:text-sm">YES</span>
        </button>

        <button
          onClick={() => setActiveView("rising-no")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "rising-no"
              ? "bg-[#ff3366]/20 border-2 border-[#ff3366] text-[#ff3366]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#ff3366]/40"
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span className="text-xs md:text-sm">NO</span>
        </button>

        <button
          onClick={() => setActiveView("new")}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
            activeView === "new"
              ? "bg-[#1F87FC]/20 border-2 border-[#1F87FC] text-[#1F87FC]"
              : "bg-[#0f0f1a] border border-border text-muted-foreground hover:border-[#1F87FC]/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs md:text-sm">New</span>
        </button>
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== "all") && (
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-muted-foreground">
            {filteredPredictions.length}{" "}
            {filteredPredictions.length === 1 ? "result" : "results"}
          </span>
          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-[#1F87FC] hover:text-[#1F87FC]/80 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Predictions Feed */}
      <div className="space-y-4 md:space-y-6">
        {filteredPredictions.length === 0 ? (
          <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-8 md:p-12 text-center">
            <Search className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
            <h3 className="text-foreground mb-2 text-sm md:text-base">
              No predictions found
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredPredictions.map((prediction) => (
            <PredictionCard
              key={prediction.id}
              prediction={prediction}
              onClick={() => onViewMarket(prediction.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
