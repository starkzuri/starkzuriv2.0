import {
  Heart,
  MessageCircle,
  Repeat2,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  Zap,
} from "lucide-react";
import { Prediction } from "../types/prediction";
import { useState, useEffect } from "react";
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
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [, setTick] = useState(0);

  // Force re-render every second to update progress
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    const start = new Date(prediction.createdAt).getTime();
    const end = new Date(prediction.endsAt).getTime();
    const progress = ((now - start) / (end - start)) * 100;
    const finalProgress = Math.min(Math.max(progress, 0), 100);
    return finalProgress;
  };

  // Helper to check if market is complete
  const isMarketComplete = () => {
    return getTimeRemaining() === "Ended" || getTimeProgress() >= 100;
  };

  // 🎮 GAMIFIED INTERVAL SYSTEM - Returns intensity level based on 20% intervals
  const getProgressInterval = () => {
    const progress = getTimeProgress();
    if (progress >= 100) return 5; // 100%: Complete
    if (progress >= 80) return 4; // 80-100%: CRITICAL
    if (progress >= 60) return 3; // 60-80%: High stakes
    if (progress >= 40) return 2; // 40-60%: Getting serious
    if (progress >= 20) return 1; // 20-40%: Warming up
    return 0; // 0-20%: Chill
  };

  // 🎨 Get theme based on interval
  const getIntervalTheme = () => {
    const interval = getProgressInterval();
    const themes = {
      0: {
        gradient: "from-[#1F87FC] via-blue-400 to-cyan-400",
        glow: "rgba(31, 135, 252, 0.5)",
        text: "text-[#1F87FC]",
        label: "Just Started",
        emoji: "🎯",
        shimmerSpeed: 3,
        pulseSpeed: 0,
      },
      1: {
        gradient: "from-[#1F87FC] via-blue-500 to-purple-400",
        glow: "rgba(31, 135, 252, 0.6)",
        text: "text-blue-400",
        label: "Building Momentum",
        emoji: "⚡",
        shimmerSpeed: 2.5,
        pulseSpeed: 0,
      },
      2: {
        gradient: "from-purple-500 via-pink-500 to-purple-600",
        glow: "rgba(168, 85, 247, 0.6)",
        text: "text-purple-400",
        label: "Heating Up",
        emoji: "🔥",
        shimmerSpeed: 2,
        pulseSpeed: 2,
      },
      3: {
        gradient: "from-orange-500 via-red-500 to-orange-600",
        glow: "rgba(249, 115, 22, 0.7)",
        text: "text-orange-400",
        label: "High Stakes",
        emoji: "🚨",
        shimmerSpeed: 1.5,
        pulseSpeed: 1.5,
      },
      4: {
        gradient: "from-red-600 via-red-500 to-red-600",
        glow: "rgba(220, 38, 38, 0.8)",
        text: "text-red-400",
        label: "FINAL PUSH",
        emoji: "💥",
        shimmerSpeed: 0.8,
        pulseSpeed: 1,
      },
      5: {
        gradient: "from-gray-500 via-gray-600 to-gray-500",
        glow: "none",
        text: "text-gray-400",
        label: "Market Closed",
        emoji: "🏁",
        shimmerSpeed: 0,
        pulseSpeed: 0,
      },
    };
    return themes[interval as keyof typeof themes] || themes[0];
  };

  const theme = getIntervalTheme();
  const interval = getProgressInterval();
  const timeProgress = getTimeProgress();
  const marketComplete = isMarketComplete();

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

      {/* 🎮 ADRENALINE BORDER PULSE - Intensifies by interval */}
      {!marketComplete && interval >= 2 && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          animate={{
            boxShadow: [
              `0 0 0px ${interval >= 4 ? "rgba(220, 38, 38, 0)" : interval >= 3 ? "rgba(249, 115, 22, 0)" : "rgba(168, 85, 247, 0)"}`,
              `0 0 ${interval >= 4 ? "30px" : interval >= 3 ? "25px" : "20px"} ${interval >= 4 ? "rgba(220, 38, 38, 0.4)" : interval >= 3 ? "rgba(249, 115, 22, 0.4)" : "rgba(168, 85, 247, 0.4)"}`,
              `0 0 0px ${interval >= 4 ? "rgba(220, 38, 38, 0)" : interval >= 3 ? "rgba(249, 115, 22, 0)" : "rgba(168, 85, 247, 0)"}`,
            ],
          }}
          transition={{
            duration: interval >= 4 ? 0.6 : interval >= 3 ? 1 : 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

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
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: particle.x,
                  y: particle.y,
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
                backgroundColor: "rgba(31, 135, 252, 0.2)",
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

        {/* 🎮 GAMIFIED PROGRESS BAR with 20% Intervals */}
        <div className="mb-4">
          {/* Progress Label with Interval-based Emoji & Text */}
          <div className="flex items-center gap-2 mb-2">
            <motion.span
              className="text-lg"
              animate={
                !marketComplete && interval >= 3
                  ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, interval >= 4 ? 20 : 10, 0],
                    }
                  : {}
              }
              transition={{
                duration: interval >= 4 ? 0.5 : 1,
                repeat: Infinity,
              }}
            >
              {theme.emoji}
            </motion.span>
            <span className={`text-xs font-bold ${theme.text}`}>
              {theme.label}
            </span>

            {/* 🎮 ADRENALINE INDICATOR - Shows at high intervals */}
            {!marketComplete && interval >= 3 && (
              <motion.div
                className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/40 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: interval >= 4 ? 0.5 : 1,
                  repeat: Infinity,
                }}
              >
                {interval >= 4 ? (
                  <Zap className="w-3 h-3 text-red-400 fill-red-400" />
                ) : (
                  <Flame className="w-3 h-3 text-orange-400" />
                )}
                <span className="text-[10px] font-black text-red-300 uppercase tracking-wide">
                  {interval >= 4 ? "CRITICAL" : "URGENT"}
                </span>
              </motion.div>
            )}
          </div>

          <div className="h-2 bg-black/40 rounded-full overflow-hidden relative border border-white/10">
            {/* Main progress bar with diagonal stripe animation */}
            <motion.div
              className={`h-full relative bg-gradient-to-r ${theme.gradient}`}
              initial={{ width: "0%" }}
              animate={{
                width: `${timeProgress}%`,
              }}
              transition={{
                width: {
                  duration: 0.5,
                  ease: "easeOut",
                },
              }}
            >
              {/* Animated diagonal stripes overlay - pump.fun style */}
              {!marketComplete && (
                <motion.div
                  className="absolute inset-0 h-full"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      rgba(255, 255, 255, 0.15) 10px,
                      rgba(255, 255, 255, 0.15) 20px
                    )`,
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}

              {/* Bright edge highlight - "alive" indicator */}
              {!marketComplete && (
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-1"
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    boxShadow: [
                      `0 0 5px ${theme.glow}`,
                      `0 0 15px ${theme.glow}`,
                      `0 0 5px ${theme.glow}`,
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                  }}
                />
              )}

              {/* Animated shimmer effect - Speed varies by interval */}
              {!marketComplete && theme.shimmerSpeed > 0 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: theme.shimmerSpeed,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}

              {/* 🎮 GAMIFIED PARTICLE EFFECTS - Increase by interval */}
              {!marketComplete && interval >= 2 && (
                <>
                  {[...Array(interval >= 4 ? 6 : interval >= 3 ? 4 : 3)].map(
                    (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          right: `${Math.random() * 30}%`,
                          top: "50%",
                        }}
                        animate={{
                          y: [-4, 4],
                          opacity: [0, 1, 0],
                          scale: [0, interval >= 4 ? 1.5 : 1, 0],
                        }}
                        transition={{
                          duration: interval >= 4 ? 0.4 : 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ),
                  )}
                </>
              )}

              {/* 🎮 LIGHTNING BOLTS for CRITICAL state */}
              {!marketComplete && interval >= 4 && (
                <>
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={`lightning-${i}`}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        right: `${10 + i * 40}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        delay: i * 0.2,
                        repeatDelay: 0.5,
                      }}
                    >
                      <Zap className="w-2 h-2 text-yellow-300 fill-yellow-300" />
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          </div>

          {/* Dynamic text with interval-based styling */}
          <div className="flex justify-between items-center text-xs mt-1">
            <span className={`font-medium ${theme.text}`}>
              {marketComplete ? "Market Closed" : "Market Progress"}
              {/* Interval-based animations */}
              {!marketComplete && interval >= 4 && (
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  ⚡
                </motion.span>
              )}
              {!marketComplete && interval === 3 && (
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🔥
                </motion.span>
              )}
            </span>

            <motion.span
              className={`font-bold font-mono ${theme.text}`}
              animate={
                !marketComplete && interval >= 3
                  ? {
                      scale: [1, 1.15, 1],
                    }
                  : {}
              }
              transition={{
                duration: interval >= 4 ? 0.5 : 1,
                repeat: Infinity,
              }}
            >
              {marketComplete ? "ENDED" : `${timeProgress.toFixed(0)}%`}
            </motion.span>
          </div>
        </div>

        {/* YES/NO Market Buttons with Enhanced Effects */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* BUY YES */}
          <motion.button
            onClick={handleBuy}
            disabled={marketComplete}
            className={`bg-gradient-to-br from-[#00ff88]/10 to-transparent border border-[#00ff88]/30 rounded-lg p-3 transition-all duration-300 group/btn relative overflow-hidden ${
              marketComplete
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-[#00ff88] hover:bg-[#00ff88]/10"
            }`}
            whileHover={
              !marketComplete
                ? {
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
                  }
                : {}
            }
            whileTap={!marketComplete ? { scale: 0.95 } : {}}
            animate={
              !marketComplete && prediction.yesPrice > 0.5
                ? {
                    borderColor: [
                      "rgba(0, 255, 136, 0.3)",
                      "rgba(0, 255, 136, 0.6)",
                      "rgba(0, 255, 136, 0.3)",
                    ],
                  }
                : {}
            }
            transition={{
              borderColor: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            {/* Shimmer Effect - only on live markets */}
            {!marketComplete && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            )}

            {/* Pulse effect for high probability */}
            {!marketComplete && prediction.yesPrice > 0.7 && (
              <motion.div
                className="absolute inset-0 bg-[#00ff88]/5 rounded-lg"
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            <div className="relative z-10 text-left">
              <div
                className={`text-xs mb-1 font-bold tracking-wide transition-colors ${
                  marketComplete
                    ? "text-muted-foreground"
                    : "text-muted-foreground group-hover/btn:text-[#00ff88]"
                }`}
              >
                YES
              </div>
              <div className="flex items-end justify-between">
                <motion.div
                  className="text-2xl font-bold text-[#00ff88]"
                  whileHover={!marketComplete ? { scale: 1.1 } : {}}
                  animate={
                    !marketComplete && prediction.yesPrice > 0.7
                      ? {
                          scale: [1, 1.05, 1],
                        }
                      : {}
                  }
                  transition={{
                    scale: {
                      duration: 1,
                      repeat: Infinity,
                    },
                  }}
                >
                  ${prediction.yesPrice.toFixed(4)}
                </motion.div>
                <div className="text-xs text-[#00ff88]/80 mb-1 font-mono">
                  {(prediction.yesPrice * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* "CLOSED" overlay for completed markets */}
            {marketComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-lg">
                <span className="text-xs font-bold text-white/60 tracking-wider">
                  CLOSED
                </span>
              </div>
            )}
          </motion.button>

          {/* BUY NO */}
          <motion.button
            onClick={handleBuy}
            disabled={marketComplete}
            className={`bg-gradient-to-br from-[#ff3366]/10 to-transparent border border-[#ff3366]/30 rounded-lg p-3 transition-all duration-300 group/btn relative overflow-hidden ${
              marketComplete
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-[#ff3366] hover:bg-[#ff3366]/10"
            }`}
            whileHover={
              !marketComplete
                ? {
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(255, 51, 102, 0.3)",
                  }
                : {}
            }
            whileTap={!marketComplete ? { scale: 0.95 } : {}}
            animate={
              !marketComplete && prediction.noPrice > 0.5
                ? {
                    borderColor: [
                      "rgba(255, 51, 102, 0.3)",
                      "rgba(255, 51, 102, 0.6)",
                      "rgba(255, 51, 102, 0.3)",
                    ],
                  }
                : {}
            }
            transition={{
              borderColor: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            {/* Shimmer Effect - only on live markets */}
            {!marketComplete && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff3366]/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            )}

            {/* Pulse effect for high probability */}
            {!marketComplete && prediction.noPrice > 0.7 && (
              <motion.div
                className="absolute inset-0 bg-[#ff3366]/5 rounded-lg"
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            <div className="relative z-10 text-left">
              <div
                className={`text-xs mb-1 font-bold tracking-wide transition-colors ${
                  marketComplete
                    ? "text-muted-foreground"
                    : "text-muted-foreground group-hover/btn:text-[#ff3366]"
                }`}
              >
                NO
              </div>
              <div className="flex items-end justify-between">
                <motion.div
                  className="text-2xl font-bold text-[#ff3366]"
                  whileHover={!marketComplete ? { scale: 1.1 } : {}}
                  animate={
                    !marketComplete && prediction.noPrice > 0.7
                      ? {
                          scale: [1, 1.05, 1],
                        }
                      : {}
                  }
                  transition={{
                    scale: {
                      duration: 1,
                      repeat: Infinity,
                    },
                  }}
                >
                  ${prediction.noPrice.toFixed(4)}
                </motion.div>
                <div className="text-xs text-[#ff3366]/80 mb-1 font-mono">
                  {(prediction.noPrice * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* "CLOSED" overlay for completed markets */}
            {marketComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-lg">
                <span className="text-xs font-bold text-white/60 tracking-wider">
                  CLOSED
                </span>
              </div>
            )}
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
              animate={
                prediction.isLiked
                  ? {
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
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
              backgroundColor: "rgba(31, 135, 252, 0.1)",
            }}
          >
            Vol: ${formatNumber(prediction.totalVolume)}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
