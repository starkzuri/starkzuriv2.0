// // import {
// //   Heart,
// //   MessageCircle,
// //   Repeat2,
// //   Clock,
// //   Play,
// //   Pause,
// //   Volume2,
// //   VolumeX,
// //   Sparkles,
// // } from "lucide-react";
// // import { Prediction } from "../types/prediction";
// // import { useState, useRef } from "react";
// // import { motion, AnimatePresence } from "motion/react";

// // interface PredictionCardProps {
// //   prediction: Prediction;
// //   onLike?: (id: string) => void;
// //   onComment?: (id: string) => void;
// //   onRepost?: (id: string) => void;
// //   onBuyYes?: (id: string) => void;
// //   onBuyNo?: (id: string) => void;
// //   onClick?: (id: string) => void;
// // }

// // export function PredictionCard({
// //   prediction,
// //   onLike,
// //   onComment,
// //   onRepost,
// //   onBuyYes,
// //   onBuyNo,
// //   onClick,
// // }: PredictionCardProps) {
// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [isMuted, setIsMuted] = useState(true);
// //   const [showLikeAnimation, setShowLikeAnimation] = useState(false);
// //   const [showXpGain, setShowXpGain] = useState(false);
// //   const [xpAmount, setXpAmount] = useState(0);
// //   const videoRef = useRef<HTMLVideoElement>(null);

// //   const getTimeRemaining = () => {
// //     const now = new Date();
// //     const end = new Date(prediction.endsAt);
// //     const diff = end.getTime() - now.getTime();

// //     if (diff <= 0) return "Ended";

// //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

// //     if (days > 0) return `${days}d ${hours}h`;
// //     return `${hours}h`;
// //   };

// //   const formatNumber = (num: number) => {
// //     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
// //     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
// //     return num.toString();
// //   };

// //   const toggleVideoPlay = (e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     if (videoRef.current) {
// //       if (isPlaying) {
// //         videoRef.current.pause();
// //       } else {
// //         videoRef.current.play();
// //       }
// //       setIsPlaying(!isPlaying);
// //     }
// //   };

// //   const toggleMute = (e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     if (videoRef.current) {
// //       videoRef.current.muted = !isMuted;
// //       setIsMuted(!isMuted);
// //     }
// //   };

// //   const handleLike = (e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     setShowLikeAnimation(true);
// //     setTimeout(() => setShowLikeAnimation(false), 1000);
// //     onLike?.(prediction.id);
// //   };

// //   const handleBuyYes = (e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     const xp = Math.floor(Math.random() * 20) + 10;
// //     setXpAmount(xp);
// //     setShowXpGain(true);
// //     setTimeout(() => setShowXpGain(false), 2000);
// //     onBuyYes?.(prediction.id);
// //   };

// //   const handleBuyNo = (e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     const xp = Math.floor(Math.random() * 20) + 10;
// //     setXpAmount(xp);
// //     setShowXpGain(true);
// //     setTimeout(() => setShowXpGain(false), 2000);
// //     onBuyNo?.(prediction.id);
// //   };

// //   return (
// //     <div
// //       className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#1F87FC]/60 hover:shadow-[0_0_20px_rgba(31,135,252,0.3)] cursor-pointer relative"
// //       onClick={() => onClick?.(prediction.id)}
// //     >
// //       {/* XP Gain Animation */}
// //       <AnimatePresence>
// //         {showXpGain && (
// //           <motion.div
// //             initial={{ opacity: 0, y: 20, scale: 0.8 }}
// //             animate={{ opacity: 1, y: -40, scale: 1 }}
// //             exit={{ opacity: 0, y: -80 }}
// //             transition={{ duration: 0.6 }}
// //             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
// //           >
// //             <div className="bg-gradient-to-r from-[#1F87FC] to-[#00ff88] px-4 py-2 rounded-full border-2 border-white flex items-center gap-2 shadow-[0_0_30px_rgba(31,135,252,0.8)]">
// //               <Sparkles className="w-5 h-5 text-white" />
// //               <span className="text-white">+{xpAmount} XP</span>
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       {/* Like Animation */}
// //       <AnimatePresence>
// //         {showLikeAnimation && (
// //           <motion.div
// //             initial={{ opacity: 0, scale: 0 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //             exit={{ opacity: 0, scale: 1.5 }}
// //             transition={{ duration: 0.5 }}
// //             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
// //           >
// //             <Heart className="w-24 h-24 text-[#ff3366] fill-current" />
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       {/* Creator Header */}
// //       <div className="flex items-center gap-3 p-4">
// //         <img
// //           src={prediction.creator.avatar}
// //           alt={prediction.creator.name}
// //           className="w-10 h-10 rounded-full border border-[#1F87FC]/40"
// //         />
// //         <div className="flex-1">
// //           <div className="flex items-center gap-2">
// //             <span className="text-foreground">{prediction.creator.name}</span>
// //             <span className="text-muted-foreground text-sm">
// //               {prediction.creator.username}
// //             </span>
// //           </div>
// //           <div className="flex items-center gap-2 text-xs text-muted-foreground">
// //             <span className="px-2 py-0.5 bg-[#1F87FC]/10 border border-[#1F87FC]/30 rounded">
// //               {prediction.category}
// //             </span>
// //             <div className="flex items-center gap-1">
// //               <Clock className="w-3 h-3" />
// //               <span>{getTimeRemaining()}</span>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Media */}
// //       <div className="relative aspect-[4/3] bg-black/40 overflow-hidden group">
// //         {prediction.media.type === "image" && (
// //           <img
// //             src={prediction.media.url}
// //             alt="Prediction media"
// //             className="w-full h-full object-cover"
// //           />
// //         )}

// //         {prediction.media.type === "video" && (
// //           <>
// //             <video
// //               ref={videoRef}
// //               src={prediction.media.url}
// //               poster={prediction.media.thumbnail}
// //               className="w-full h-full object-cover"
// //               loop
// //               muted={isMuted}
// //               playsInline
// //             />

// //             {/* Video Controls Overlay */}
// //             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
// //               <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
// //                 <button
// //                   onClick={toggleVideoPlay}
// //                   className="bg-[#1F87FC]/80 hover:bg-[#1F87FC] border border-[#1F87FC] rounded-full p-3 transition-all"
// //                 >
// //                   {isPlaying ? (
// //                     <Pause className="w-5 h-5 text-white" />
// //                   ) : (
// //                     <Play className="w-5 h-5 text-white" />
// //                   )}
// //                 </button>

// //                 <button
// //                   onClick={toggleMute}
// //                   className="bg-[#1F87FC]/80 hover:bg-[#1F87FC] border border-[#1F87FC] rounded-full p-3 transition-all"
// //                 >
// //                   {isMuted ? (
// //                     <VolumeX className="w-5 h-5 text-white" />
// //                   ) : (
// //                     <Volume2 className="w-5 h-5 text-white" />
// //                   )}
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Play Icon When Not Playing */}
// //             {!isPlaying && (
// //               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
// //                 <div className="bg-[#1F87FC]/80 rounded-full p-6">
// //                   <Play className="w-12 h-12 text-white" />
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}

// //         {prediction.media.type === "audio" && (
// //           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F87FC]/10 to-transparent">
// //             <div className="flex gap-1 items-end">
// //               {Array.from({ length: 40 }).map((_, i) => (
// //                 <motion.div
// //                   key={i}
// //                   className="w-1 bg-[#1F87FC] rounded-full"
// //                   style={{ height: `${Math.random() * 60 + 20}%` }}
// //                   animate={{
// //                     height: [
// //                       `${Math.random() * 60 + 20}%`,
// //                       `${Math.random() * 60 + 20}%`,
// //                     ],
// //                   }}
// //                   transition={{
// //                     duration: 0.5,
// //                     repeat: Infinity,
// //                     repeatType: "reverse",
// //                   }}
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Question */}
// //       <div className="p-4">
// //         <h3 className="text-foreground mb-4">{prediction.question}</h3>

// //         {/* YES/NO Market */}
// //         <div className="grid grid-cols-2 gap-3 mb-4">
// //           {/* BUY YES */}
// //           <motion.button
// //             onClick={handleBuyYes}
// //             className="bg-gradient-to-br from-[#00ff88]/20 to-transparent border border-[#00ff88]/40 rounded-lg p-4 transition-all duration-300 hover:border-[#00ff88] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] group relative overflow-hidden"
// //             whileTap={{ scale: 0.95 }}
// //           >
// //             <motion.div
// //               className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/30 to-transparent"
// //               initial={{ x: "-100%" }}
// //               whileHover={{ x: "100%" }}
// //               transition={{ duration: 0.5 }}
// //             />
// //             <div className="relative z-10">
// //               <div className="text-xs text-muted-foreground mb-1">BUY YES</div>
// //               <div className="text-2xl text-[#00ff88] mb-1">
// //                 ${prediction.yesPrice.toFixed(4)}
// //               </div>
// //               <div className="text-xs text-muted-foreground">
// //                 {formatNumber(prediction.yesShares)} shares
// //               </div>
// //             </div>
// //           </motion.button>

// //           {/* BUY NO */}
// //           <motion.button
// //             onClick={handleBuyNo}
// //             className="bg-gradient-to-br from-[#ff3366]/20 to-transparent border border-[#ff3366]/40 rounded-lg p-4 transition-all duration-300 hover:border-[#ff3366] hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] group relative overflow-hidden"
// //             whileTap={{ scale: 0.95 }}
// //           >
// //             <motion.div
// //               className="absolute inset-0 bg-gradient-to-r from-[#ff3366]/30 to-transparent"
// //               initial={{ x: "-100%" }}
// //               whileHover={{ x: "100%" }}
// //               transition={{ duration: 0.5 }}
// //             />
// //             <div className="relative z-10">
// //               <div className="text-xs text-muted-foreground mb-1">BUY NO</div>
// //               <div className="text-2xl text-[#ff3366] mb-1">
// //                 ${prediction.noPrice.toFixed(4)}
// //               </div>
// //               <div className="text-xs text-muted-foreground">
// //                 {formatNumber(prediction.noShares)} shares
// //               </div>
// //             </div>
// //           </motion.button>
// //         </div>

// //         {/* Social Actions */}
// //         <div className="flex items-center gap-6 pt-4 border-t border-border">
// //           <motion.button
// //             onClick={handleLike}
// //             className={`flex items-center gap-2 transition-colors ${
// //               prediction.isLiked
// //                 ? "text-[#ff3366]"
// //                 : "text-muted-foreground hover:text-[#1F87FC]"
// //             }`}
// //             whileTap={{ scale: 1.2 }}
// //           >
// //             <Heart
// //               className={`w-5 h-5 ${prediction.isLiked ? "fill-current" : ""}`}
// //             />
// //             <span className="text-sm">{formatNumber(prediction.likes)}</span>
// //           </motion.button>

// //           <motion.button
// //             onClick={(e) => {
// //               e.stopPropagation();
// //               onComment?.(prediction.id);
// //             }}
// //             className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
// //             whileTap={{ scale: 1.1 }}
// //           >
// //             <MessageCircle className="w-5 h-5" />
// //             <span className="text-sm">{formatNumber(prediction.comments)}</span>
// //           </motion.button>

// //           <motion.button
// //             onClick={(e) => {
// //               e.stopPropagation();
// //               onRepost?.(prediction.id);
// //             }}
// //             className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
// //             whileTap={{ scale: 1.1, rotate: 180 }}
// //           >
// //             <Repeat2 className="w-5 h-5" />
// //             <span className="text-sm">{formatNumber(prediction.reposts)}</span>
// //           </motion.button>

// //           <div className="ml-auto text-xs text-muted-foreground">
// //             Vol: ${formatNumber(prediction.totalVolume)}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import {
//   Heart,
//   MessageCircle,
//   Repeat2,
//   Clock,
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Sparkles,
// } from "lucide-react";
// import { Prediction } from "../types/prediction";
// import { useState, useRef } from "react";
// import { motion, AnimatePresence } from "motion/react";

// interface PredictionCardProps {
//   prediction: Prediction;
//   onLike?: (id: string) => void;
//   onComment?: (id: string) => void;
//   onRepost?: (id: string) => void;
//   onBuyYes?: (id: string) => void; // Kept for future flexibility
//   onBuyNo?: (id: string) => void; // Kept for future flexibility
//   onClick?: (id: string) => void;
// }

// export function PredictionCard({
//   prediction,
//   onLike,
//   onComment,
//   onRepost,
//   onBuyYes,
//   onBuyNo,
//   onClick,
// }: PredictionCardProps) {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [showLikeAnimation, setShowLikeAnimation] = useState(false);
//   // 🟢 REMOVED: XP State (No longer needed on the card)
//   const videoRef = useRef<HTMLVideoElement>(null);

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

//   const toggleVideoPlay = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const toggleMute = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   const handleLike = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setShowLikeAnimation(true);
//     setTimeout(() => setShowLikeAnimation(false), 1000);
//     onLike?.(prediction.id);
//   };

//   // 🟢 UPDATE: Navigate to Detail Page (Buy YES)
//   const handleBuyYes = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent double click
//     onClick?.(prediction.id); // Navigate to Market Detail
//   };

//   // 🟢 UPDATE: Navigate to Detail Page (Buy NO)
//   const handleBuyNo = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent double click
//     onClick?.(prediction.id); // Navigate to Market Detail
//   };

//   return (
//     <div
//       className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#1F87FC]/60 hover:shadow-[0_0_20px_rgba(31,135,252,0.3)] cursor-pointer relative"
//       onClick={() => onClick?.(prediction.id)}
//     >
//       {/* Like Animation */}
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
//       <div className="flex items-center gap-3 p-4">
//         <img
//           src={prediction.creator.avatar}
//           alt={prediction.creator.name}
//           className="w-10 h-10 rounded-full border border-[#1F87FC]/40"
//         />
//         <div className="flex-1">
//           <div className="flex items-center gap-2">
//             <span className="text-foreground">{prediction.creator.name}</span>
//             <span className="text-muted-foreground text-sm">
//               {prediction.creator.username}
//             </span>
//           </div>
//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <span className="px-2 py-0.5 bg-[#1F87FC]/10 border border-[#1F87FC]/30 rounded">
//               {prediction.category}
//             </span>
//             <div className="flex items-center gap-1">
//               <Clock className="w-3 h-3" />
//               <span>{getTimeRemaining()}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Media */}
//       <div className="relative aspect-[4/3] bg-black/40 overflow-hidden group">
//         {prediction.media.type === "image" && (
//           <img
//             src={prediction.media.url}
//             alt="Prediction media"
//             className="w-full h-full object-cover"
//           />
//         )}

//         {prediction.media.type === "video" && (
//           <>
//             <video
//               ref={videoRef}
//               src={prediction.media.url}
//               poster={prediction.media.thumbnail}
//               className="w-full h-full object-cover"
//               loop
//               muted={isMuted}
//               playsInline
//             />

//             {/* Video Controls Overlay */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//               <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
//                 <button
//                   onClick={toggleVideoPlay}
//                   className="bg-[#1F87FC]/80 hover:bg-[#1F87FC] border border-[#1F87FC] rounded-full p-3 transition-all"
//                 >
//                   {isPlaying ? (
//                     <Pause className="w-5 h-5 text-white" />
//                   ) : (
//                     <Play className="w-5 h-5 text-white" />
//                   )}
//                 </button>

//                 <button
//                   onClick={toggleMute}
//                   className="bg-[#1F87FC]/80 hover:bg-[#1F87FC] border border-[#1F87FC] rounded-full p-3 transition-all"
//                 >
//                   {isMuted ? (
//                     <VolumeX className="w-5 h-5 text-white" />
//                   ) : (
//                     <Volume2 className="w-5 h-5 text-white" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Play Icon When Not Playing */}
//             {!isPlaying && (
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="bg-[#1F87FC]/80 rounded-full p-6">
//                   <Play className="w-12 h-12 text-white" />
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {prediction.media.type === "audio" && (
//           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F87FC]/10 to-transparent">
//             {/* Audio Visualizer Animation */}
//             <div className="flex gap-1 items-end">
//               {Array.from({ length: 40 }).map((_, i) => (
//                 <motion.div
//                   key={i}
//                   className="w-1 bg-[#1F87FC] rounded-full"
//                   style={{ height: `${Math.random() * 60 + 20}%` }}
//                   animate={{
//                     height: [
//                       `${Math.random() * 60 + 20}%`,
//                       `${Math.random() * 60 + 20}%`,
//                     ],
//                   }}
//                   transition={{
//                     duration: 0.5,
//                     repeat: Infinity,
//                     repeatType: "reverse",
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Question */}
//       <div className="p-4">
//         <h3 className="text-foreground mb-4">{prediction.question}</h3>

//         {/* YES/NO Market Buttons */}
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           {/* BUY YES */}
//           <motion.button
//             onClick={handleBuyYes}
//             className="bg-gradient-to-br from-[#00ff88]/20 to-transparent border border-[#00ff88]/40 rounded-lg p-4 transition-all duration-300 hover:border-[#00ff88] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] group relative overflow-hidden"
//             whileTap={{ scale: 0.95 }}
//           >
//             <motion.div
//               className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/30 to-transparent"
//               initial={{ x: "-100%" }}
//               whileHover={{ x: "100%" }}
//               transition={{ duration: 0.5 }}
//             />
//             <div className="relative z-10">
//               <div className="text-xs text-muted-foreground mb-1 group-hover:text-[#00ff88] transition-colors">
//                 BUY YES
//               </div>
//               <div className="text-2xl text-[#00ff88] mb-1">
//                 ${prediction.yesPrice.toFixed(4)}
//               </div>
//               {/* 🟢 UPDATE: Shows Probability */}
//               <div className="text-xs text-muted-foreground">
//                 {(prediction.yesPrice * 100).toFixed(0)}% Prob
//               </div>
//             </div>
//           </motion.button>

//           {/* BUY NO */}
//           <motion.button
//             onClick={handleBuyNo}
//             className="bg-gradient-to-br from-[#ff3366]/20 to-transparent border border-[#ff3366]/40 rounded-lg p-4 transition-all duration-300 hover:border-[#ff3366] hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] group relative overflow-hidden"
//             whileTap={{ scale: 0.95 }}
//           >
//             <motion.div
//               className="absolute inset-0 bg-gradient-to-r from-[#ff3366]/30 to-transparent"
//               initial={{ x: "-100%" }}
//               whileHover={{ x: "100%" }}
//               transition={{ duration: 0.5 }}
//             />
//             <div className="relative z-10">
//               <div className="text-xs text-muted-foreground mb-1 group-hover:text-[#ff3366] transition-colors">
//                 BUY NO
//               </div>
//               <div className="text-2xl text-[#ff3366] mb-1">
//                 ${prediction.noPrice.toFixed(4)}
//               </div>
//               {/* 🟢 UPDATE: Shows Probability */}
//               <div className="text-xs text-muted-foreground">
//                 {(prediction.noPrice * 100).toFixed(0)}% Prob
//               </div>
//             </div>
//           </motion.button>
//         </div>

//         {/* Social Actions */}
//         <div className="flex items-center gap-6 pt-4 border-t border-border">
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
//               className={`w-5 h-5 ${prediction.isLiked ? "fill-current" : ""}`}
//             />
//             <span className="text-sm">{formatNumber(prediction.likes)}</span>
//           </motion.button>

//           <motion.button
//             onClick={(e) => {
//               e.stopPropagation();
//               onComment?.(prediction.id);
//             }}
//             className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
//             whileTap={{ scale: 1.1 }}
//           >
//             <MessageCircle className="w-5 h-5" />
//             <span className="text-sm">{formatNumber(prediction.comments)}</span>
//           </motion.button>

//           <motion.button
//             onClick={(e) => {
//               e.stopPropagation();
//               onRepost?.(prediction.id);
//             }}
//             className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
//             whileTap={{ scale: 1.1, rotate: 180 }}
//           >
//             <Repeat2 className="w-5 h-5" />
//             <span className="text-sm">{formatNumber(prediction.reposts)}</span>
//           </motion.button>

//           <div className="ml-auto text-xs text-muted-foreground">
//             Vol: ${formatNumber(prediction.totalVolume)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
                  ${prediction.yesPrice.toFixed(2)}
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
                  ${prediction.noPrice.toFixed(2)}
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
