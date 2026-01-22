import { useState, useEffect, useRef, useCallback } from "react";
import { PredictionCard } from "./PredictionCard";
import { Sparkles, Users, Loader2 } from "lucide-react";
import { Prediction } from "../types/prediction";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";

// 🟢 CONFIG
const PAGE_SIZE = 5; // Load 5 at a time
const API_URL = "https://starknet-indexer-apibara-d7ss.onrender.com";

interface HomeFeedProps {
  onViewMarket: (id: string) => void;
}

type FeedTab = "for-you" | "following";

export function HomeFeed({ onViewMarket }: HomeFeedProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");

  // 🟢 Pagination State
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false); // Loading NEW items
  const [initialLoading, setInitialLoading] = useState(true); // First load
  const [hasMore, setHasMore] = useState(true);

  // 🟢 Observer Ref
  const observer = useRef<IntersectionObserver | null>(null);

  // 🟢 Fetch Function
  const fetchMarkets = async (pageIndex: number) => {
    setLoading(true);
    try {
      const offset = pageIndex * PAGE_SIZE;
      const res = await fetch(
        `${API_URL}/markets?limit=${PAGE_SIZE}&offset=${offset}`,
      );
      const data: ApiMarket[] = await res.json();
      const formattedData = data.map(mapMarketToPrediction);

      setPredictions((prev) => {
        // ⚠️ Prevent Duplicates (React Strict Mode safety)
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = formattedData.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });

      // If we got fewer items than requested, we reached the end
      if (formattedData.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch markets:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // 🟢 Initial Load
  useEffect(() => {
    fetchMarkets(0);
  }, []);

  // 🟢 The "Last Element" Trigger
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // 🚀 Trigger next page
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchMarkets(nextPage); // Fetch immediately
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // --- Handlers (Unchanged) ---
  const handleLike = (id: string) => {
    setPredictions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const handleComment = (id: string) => console.log("Comment:", id);
  const handleRepost = (id: string) => console.log("Repost:", id);

  // Filter Logic
  const getFilteredPredictions = () => {
    if (activeTab === "following") return predictions.slice(0, 3); // Mock for now
    return predictions;
  };

  if (initialLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto py-20 text-center">
        <Sparkles className="w-10 h-10 text-[#1F87FC] animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Syncing with Starknet...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20">
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
          // 🟢 MAP THROUGH PREDICTIONS
          getFilteredPredictions().map((prediction, index) => {
            // If it's the LAST item, attach the Observer Ref
            if (index === getFilteredPredictions().length - 1) {
              return (
                <div ref={lastElementRef} key={prediction.id}>
                  <PredictionCard
                    prediction={prediction}
                    onLike={handleLike}
                    onComment={handleComment}
                    onRepost={handleRepost}
                    onClick={() => onViewMarket(prediction.id)}
                  />
                </div>
              );
            }
            return (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onLike={handleLike}
                onComment={handleComment}
                onRepost={handleRepost}
                onClick={() => onViewMarket(prediction.id)}
              />
            );
          })
        )}

        {/* 🟢 Bottom Loading Spinner */}
        {loading && hasMore && (
          <div className="py-4 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#1F87FC]" />
          </div>
        )}

        {/* 🟢 End of Feed Message */}
        {!hasMore && predictions.length > 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            You're all caught up! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
