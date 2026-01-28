// import { Heart, MessageCircle, Repeat2, Clock, Sparkles } from "lucide-react";
// import { Prediction } from "../types/prediction";
// import { useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// // 🟢 Import the smart component
// import { MediaPreview } from "./MediaPreview";

// interface PredictionCardProps {
//   prediction: Prediction;
//   onLike?: (id: string) => void;
//   onComment?: (id: string) => void;
//   onRepost?: (id: string) => void;
//   onBuyYes?: (id: string) => void;
//   onBuyNo?: (id: string) => void;
//   onClick?: (id: string) => void;
// }

// export function PredictionCard({
//   prediction,
//   onLike,
//   onComment,
//   onRepost,
//   onClick,
// }: PredictionCardProps) {
//   const [showLikeAnimation, setShowLikeAnimation] = useState(false);

//   // 🟢 REMOVED: All manual video state (isPlaying, isMuted, videoRef)
//   // MediaPreview handles this now.

//   const getTimeRemaining = () => {
//     const now = new Date();
//     const end = new Date(prediction.endsAt);
//     const diff = end.getTime() - now.getTime();

//     if (diff <= 0) return "Ended";

//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

//     if (days > 0) return `${days}d ${hours}h`;
//     return `${hours}h`;
//   };

//   const formatNumber = (num: number) => {
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   const handleLike = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setShowLikeAnimation(true);
//     setTimeout(() => setShowLikeAnimation(false), 1000);
//     onLike?.(prediction.id);
//   };

//   const handleBuy = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onClick?.(prediction.id); // Navigate to Market Detail
//   };

//   return (
//     <div
//       className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#1F87FC]/60 hover:shadow-[0_0_20px_rgba(31,135,252,0.3)] cursor-pointer relative group"
//       onClick={() => onClick?.(prediction.id)}
//     >
//       {/* Like Animation Overlay */}
//       <AnimatePresence>
//         {showLikeAnimation && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 1.5 }}
//             transition={{ duration: 0.5 }}
//             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
//           >
//             <Heart className="w-24 h-24 text-[#ff3366] fill-current" />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Creator Header */}
//       <div className="flex items-center gap-3 p-4 border-b border-white/5">
//         <img
//           src={prediction.creator.avatar}
//           alt={prediction.creator.name}
//           className="w-10 h-10 rounded-full border border-[#1F87FC]/40"
//         />
//         <div className="flex-1">
//           <div className="flex items-center gap-2">
//             <span className="text-foreground font-medium">
//               {prediction.creator.name}
//             </span>
//             <span className="text-muted-foreground text-sm">
//               {prediction.creator.username}
//             </span>
//           </div>
//           <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
//             <span className="px-2 py-0.5 bg-[#1F87FC]/10 border border-[#1F87FC]/30 rounded text-[#1F87FC]">
//               {prediction.category}
//             </span>
//             <div className="flex items-center gap-1">
//               <Clock className="w-3 h-3" />
//               <span>{getTimeRemaining()}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🟢 NEW MEDIA BLOCK: Clean & Smart */}
//       {/* We removed the manual video/img tags and used the component */}
//       <div className="w-full">
//         <MediaPreview
//           src={prediction.media.url}
//           alt={prediction.question}
//           // We try to pass the type if we know it, otherwise undefined lets the component auto-detect
//           type={prediction.media.type === "video" ? "video" : undefined}
//           className="rounded-none border-y border-[#1F87FC]/10" // Custom styling to fit card
//         />
//       </div>

//       {/* Question & Content */}
//       <div className="p-4">
//         <h3 className="text-foreground mb-4 font-bold text-lg leading-snug group-hover:text-[#1F87FC] transition-colors">
//           {prediction.question}
//         </h3>

//         {/* YES/NO Market Buttons */}
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           {/* BUY YES */}
//           <motion.button
//             onClick={handleBuy}
//             className="bg-gradient-to-br from-[#00ff88]/10 to-transparent border border-[#00ff88]/30 rounded-lg p-3 transition-all duration-300 hover:border-[#00ff88] hover:bg-[#00ff88]/10 group/btn relative overflow-hidden"
//             whileTap={{ scale: 0.98 }}
//           >
//             <div className="relative z-10 text-left">
//               <div className="text-xs text-muted-foreground mb-1 group-hover/btn:text-[#00ff88] transition-colors font-bold tracking-wide">
//                 YES
//               </div>
//               <div className="flex items-end justify-between">
//                 <div className="text-2xl font-bold text-[#00ff88]">
//                   ${prediction.yesPrice.toFixed(4)}
//                 </div>
//                 <div className="text-xs text-[#00ff88]/80 mb-1 font-mono">
//                   {(prediction.yesPrice * 100).toFixed(0)}%
//                 </div>
//               </div>
//             </div>
//           </motion.button>

//           {/* BUY NO */}
//           <motion.button
//             onClick={handleBuy}
//             className="bg-gradient-to-br from-[#ff3366]/10 to-transparent border border-[#ff3366]/30 rounded-lg p-3 transition-all duration-300 hover:border-[#ff3366] hover:bg-[#ff3366]/10 group/btn relative overflow-hidden"
//             whileTap={{ scale: 0.98 }}
//           >
//             <div className="relative z-10 text-left">
//               <div className="text-xs text-muted-foreground mb-1 group-hover/btn:text-[#ff3366] transition-colors font-bold tracking-wide">
//                 NO
//               </div>
//               <div className="flex items-end justify-between">
//                 <div className="text-2xl font-bold text-[#ff3366]">
//                   ${prediction.noPrice.toFixed(4)}
//                 </div>
//                 <div className="text-xs text-[#ff3366]/80 mb-1 font-mono">
//                   {(prediction.noPrice * 100).toFixed(0)}%
//                 </div>
//               </div>
//             </div>
//           </motion.button>
//         </div>

//         {/* Social Actions */}
//         <div className="flex items-center gap-6 pt-4 border-t border-white/5">
//           <motion.button
//             onClick={handleLike}
//             className={`flex items-center gap-2 transition-colors ${
//               prediction.isLiked
//                 ? "text-[#ff3366]"
//                 : "text-muted-foreground hover:text-[#1F87FC]"
//             }`}
//             whileTap={{ scale: 1.2 }}
//           >
//             <Heart
//               className={`w-4 h-4 ${prediction.isLiked ? "fill-current" : ""}`}
//             />
//             <span className="text-xs font-medium">
//               {formatNumber(prediction.likes)}
//             </span>
//           </motion.button>

//           <motion.button
//             onClick={(e) => {
//               e.stopPropagation();
//               onComment?.(prediction.id);
//             }}
//             className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
//             whileTap={{ scale: 1.1 }}
//           >
//             <MessageCircle className="w-4 h-4" />
//             <span className="text-xs font-medium">
//               {formatNumber(prediction.comments)}
//             </span>
//           </motion.button>

//           <motion.button
//             onClick={(e) => {
//               e.stopPropagation();
//               onRepost?.(prediction.id);
//             }}
//             className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
//             whileTap={{ scale: 1.1, rotate: 180 }}
//           >
//             <Repeat2 className="w-4 h-4" />
//             <span className="text-xs font-medium">
//               {formatNumber(prediction.reposts)}
//             </span>
//           </motion.button>

//           <div className="ml-auto text-xs text-muted-foreground font-mono bg-white/5 px-2 py-1 rounded">
//             Vol: ${formatNumber(prediction.totalVolume)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Heart, MessageCircle, Repeat2, Clock, Sparkles, TrendingUp, Award } from "lucide-react";
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
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

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
    
    // Create particles effect
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
    
    onLike?.(prediction.id);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(prediction.id); // Navigate to Market Detail
  };

  // Calculate progress (time elapsed)
  const getTimeProgress = () => {
    const now = new Date().getTime();
    const start = new Date(prediction.endsAt).getTime() - (7 * 24 * 60 * 60 * 1000); // Assume 7 days total
    const end = new Date(prediction.endsAt).getTime();
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <motion.div
      className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#1F87FC]/60 hover:shadow-[0_0_20px_rgba(31,135,252,0.3)] cursor-pointer relative group"
      onClick={() => onClick?.(prediction.id)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Animated Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#1F87FC]/0 via-[#1F87FC]/10 to-[#1F87FC]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />

      {/* Like Animation Overlay with Particles */}
      <AnimatePresence>
        {showLikeAnimation && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
            >
              <Heart className="w-24 h-24 text-[#ff3366] fill-current drop-shadow-[0_0_20px_rgba(255,51,102,0.8)]" />
            </motion.div>
            
            {/* Particle Effects */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ 
                  opacity: 1, 
                  scale: 1,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 0,
                  x: particle.x,
                  y: particle.y
                }}
                transition={{ duration: 0.8 }}
                className="absolute top-1/2 left-1/2 z-40 pointer-events-none"
              >
                <Sparkles className="w-4 h-4 text-[#ff3366] fill-current" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Creator Header with Badges */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <motion.img
          src={prediction.creator.avatar}
          alt={prediction.creator.name}
          className="w-10 h-10 rounded-full border border-[#1F87FC]/40"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">
              {prediction.creator.name}
            </span>
            {prediction.totalVolume > 10000 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <Award className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </motion.div>
            )}
            <span className="text-muted-foreground text-sm">
              {prediction.creator.username}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <motion.span 
              className="px-2 py-0.5 bg-[#1F87FC]/10 border border-[#1F87FC]/30 rounded text-[#1F87FC]"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(31, 135, 252, 0.2)"
              }}
            >
              {prediction.category}
            </motion.span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{getTimeRemaining()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 NEW MEDIA BLOCK: Clean & Smart */}
      <div className="w-full relative overflow-hidden">
        <MediaPreview
          src={prediction.media.url}
          alt={prediction.question}
          type={prediction.media.type === "video" ? "video" : undefined}
          className="rounded-none border-y border-[#1F87FC]/10"
        />
        
        {/* Trending Indicator for High Volume */}
        {prediction.totalVolume > 50000 && (
          <motion.div
            className="absolute top-3 right-3 bg-orange-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <TrendingUp className="w-3 h-3 text-white" />
            </motion.div>
            <span className="text-xs font-bold text-white">HOT</span>
          </motion.div>
        )}
      </div>

      {/* Question & Content */}
      <div className="p-4">
        <h3 className="text-foreground mb-4 font-bold text-lg leading-snug group-hover:text-[#1F87FC] transition-colors">
          {prediction.question}
        </h3>

        {/* Progress Bar - Time Remaining */}
        <div className="mb-4">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#1F87FC] to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${getTimeProgress()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Market Progress</span>
            <span>{getTimeProgress().toFixed(0)}%</span>
          </div>
        </div>

        {/* YES/NO Market Buttons with Enhanced Effects */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* BUY YES */}
          <motion.button
            onClick={handleBuy}
            className="bg-gradient-to-br from-[#00ff88]/10 to-transparent border border-[#00ff88]/30 rounded-lg p-3 transition-all duration-300 hover:border-[#00ff88] hover:bg-[#00ff88]/10 group/btn relative overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <div className="relative z-10 text-left">
              <div className="text-xs text-muted-foreground mb-1 group-hover/btn:text-[#00ff88] transition-colors font-bold tracking-wide">
                YES
              </div>
              <div className="flex items-end justify-between">
                <motion.div 
                  className="text-2xl font-bold text-[#00ff88]"
                  whileHover={{ scale: 1.1 }}
                >
                  ${prediction.yesPrice.toFixed(4)}
                </motion.div>
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
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255, 51, 102, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff3366]/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <div className="relative z-10 text-left">
              <div className="text-xs text-muted-foreground mb-1 group-hover/btn:text-[#ff3366] transition-colors font-bold tracking-wide">
                NO
              </div>
              <div className="flex items-end justify-between">
                <motion.div 
                  className="text-2xl font-bold text-[#ff3366]"
                  whileHover={{ scale: 1.1 }}
                >
                  ${prediction.noPrice.toFixed(4)}
                </motion.div>
                <div className="text-xs text-[#ff3366]/80 mb-1 font-mono">
                  {(prediction.noPrice * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Social Actions with Enhanced Interactions */}
        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <motion.button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${
              prediction.isLiked
                ? "text-[#ff3366]"
                : "text-muted-foreground hover:text-[#1F87FC]"
            }`}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 1.3 }}
          >
            <motion.div
              animate={prediction.isLiked ? { 
                scale: [1, 1.2, 1],
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-4 h-4 ${prediction.isLiked ? "fill-current" : ""}`}
              />
            </motion.div>
            <motion.span 
              className="text-xs font-medium"
              key={prediction.likes}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {formatNumber(prediction.likes)}
            </motion.span>
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onComment?.(prediction.id);
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
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
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9, rotate: 180 }}
          >
            <Repeat2 className="w-4 h-4" />
            <span className="text-xs font-medium">
              {formatNumber(prediction.reposts)}
            </span>
          </motion.button>

          <motion.div 
            className="ml-auto text-xs text-muted-foreground font-mono bg-white/5 px-2 py-1 rounded"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(31, 135, 252, 0.1)"
            }}
          >
            Vol: ${formatNumber(prediction.totalVolume)}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
