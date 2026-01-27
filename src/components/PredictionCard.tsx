import { Heart, MessageCircle, Repeat2, Clock, Sparkles } from "lucide-react";
import { Prediction } from "../types/prediction";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
// 🟢 Import the smart component
import { MediaPreview } from "./MediaPreview";

interface PredictionCardProps {
  prediction: Prediction;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onRepost?: (id: string) => void;
  onBuyYes?: (id: string) => void;
  onBuyNo?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function PredictionCard({
  prediction,
  onLike,
  onComment,
  onRepost,
  onClick,
}: PredictionCardProps) {
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  // 🟢 REMOVED: All manual video state (isPlaying, isMuted, videoRef)
  // MediaPreview handles this now.

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(prediction.endsAt);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLikeAnimation(true);
    setTimeout(() => setShowLikeAnimation(false), 1000);
    onLike?.(prediction.id);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(prediction.id); // Navigate to Market Detail
  };

  return (
    <div
      className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#1F87FC]/60 hover:shadow-[0_0_20px_rgba(31,135,252,0.3)] cursor-pointer relative group"
      onClick={() => onClick?.(prediction.id)}
    >
      {/* Like Animation Overlay */}
      <AnimatePresence>
        {showLikeAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
          >
            <Heart className="w-24 h-24 text-[#ff3366] fill-current" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creator Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <img
          src={prediction.creator.avatar}
          alt={prediction.creator.name}
          className="w-10 h-10 rounded-full border border-[#1F87FC]/40"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">
              {prediction.creator.name}
            </span>
            <span className="text-muted-foreground text-sm">
              {prediction.creator.username}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span className="px-2 py-0.5 bg-[#1F87FC]/10 border border-[#1F87FC]/30 rounded text-[#1F87FC]">
              {prediction.category}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{getTimeRemaining()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 NEW MEDIA BLOCK: Clean & Smart */}
      {/* We removed the manual video/img tags and used the component */}
      <div className="w-full">
        <MediaPreview
          src={prediction.media.url}
          alt={prediction.question}
          // We try to pass the type if we know it, otherwise undefined lets the component auto-detect
          type={prediction.media.type === "video" ? "video" : undefined}
          className="rounded-none border-y border-[#1F87FC]/10" // Custom styling to fit card
        />
      </div>

      {/* Question & Content */}
      <div className="p-4">
        <h3 className="text-foreground mb-4 font-bold text-lg leading-snug group-hover:text-[#1F87FC] transition-colors">
          {prediction.question}
        </h3>

        {/* YES/NO Market Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* BUY YES */}
          <motion.button
            onClick={handleBuy}
            className="bg-gradient-to-br from-[#00ff88]/10 to-transparent border border-[#00ff88]/30 rounded-lg p-3 transition-all duration-300 hover:border-[#00ff88] hover:bg-[#00ff88]/10 group/btn relative overflow-hidden"
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative z-10 text-left">
              <div className="text-xs text-muted-foreground mb-1 group-hover/btn:text-[#00ff88] transition-colors font-bold tracking-wide">
                YES
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-[#00ff88]">
                  ${prediction.yesPrice.toFixed(4)}
                </div>
                <div className="text-xs text-[#00ff88]/80 mb-1 font-mono">
                  {(prediction.yesPrice * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </motion.button>

          {/* BUY NO */}
          <motion.button
            onClick={handleBuy}
            className="bg-gradient-to-br from-[#ff3366]/10 to-transparent border border-[#ff3366]/30 rounded-lg p-3 transition-all duration-300 hover:border-[#ff3366] hover:bg-[#ff3366]/10 group/btn relative overflow-hidden"
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative z-10 text-left">
              <div className="text-xs text-muted-foreground mb-1 group-hover/btn:text-[#ff3366] transition-colors font-bold tracking-wide">
                NO
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-[#ff3366]">
                  ${prediction.noPrice.toFixed(4)}
                </div>
                <div className="text-xs text-[#ff3366]/80 mb-1 font-mono">
                  {(prediction.noPrice * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Social Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <motion.button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${
              prediction.isLiked
                ? "text-[#ff3366]"
                : "text-muted-foreground hover:text-[#1F87FC]"
            }`}
            whileTap={{ scale: 1.2 }}
          >
            <Heart
              className={`w-4 h-4 ${prediction.isLiked ? "fill-current" : ""}`}
            />
            <span className="text-xs font-medium">
              {formatNumber(prediction.likes)}
            </span>
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onComment?.(prediction.id);
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
            whileTap={{ scale: 1.1 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">
              {formatNumber(prediction.comments)}
            </span>
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onRepost?.(prediction.id);
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
            whileTap={{ scale: 1.1, rotate: 180 }}
          >
            <Repeat2 className="w-4 h-4" />
            <span className="text-xs font-medium">
              {formatNumber(prediction.reposts)}
            </span>
          </motion.button>

          <div className="ml-auto text-xs text-muted-foreground font-mono bg-white/5 px-2 py-1 rounded">
            Vol: ${formatNumber(prediction.totalVolume)}
          </div>
        </div>
      </div>
    </div>
  );
}
