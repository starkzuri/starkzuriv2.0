import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Loader2,
  Wallet,
  Trophy,
  CheckCircle, // 🟢 Added Icon
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { MediaPreview } from "./MediaPreview";
import { mapMarketToPrediction, ApiMarket } from "../lib/marketMapper";
import { Prediction } from "../types/prediction";
import { toast } from "sonner";
import { CallData } from "starknet";

const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

interface UserPosition {
  prediction: Prediction;
  marketId: string;
  yesShares: number;
  noShares: number;
  invested: number;
  currentValue: number;
  profitLoss: number;
  status: number;
  outcome?: boolean;
  hasClaimed: boolean; // 🟢 Added this flag
}

interface PortfolioProps {
  onViewMarket: (id: string) => void;
}

export function Portfolio({ onViewMarket }: PortfolioProps) {
  const { address, connectWallet, account } = useWallet();
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // 1. Fetch Real Data
  useEffect(() => {
    if (!address) return;

    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const marketsRes = await fetch(`${API_URL}/markets`);
        const marketsData: ApiMarket[] = await marketsRes.json();
        const posRes = await fetch(`${API_URL}/positions/${address}`);
        const myBets = await posRes.json();
        console.log("mybets ", myBets);

        const activePositions: UserPosition[] = myBets
          .map((bet: any) => {
            const market = marketsData.find((m) => m.marketId === bet.marketId);
            if (!market) return null;

            const formattedPrediction = mapMarketToPrediction(market);
            const yesShares = Number(bet.yesShares);
            const noShares = Number(bet.noShares);

            if (yesShares <= 0 && noShares <= 0) return null;

            // 🟢 FIX 1: Use REAL Invested Amount (with fallback just in case)
            // Checks both snake_case (raw DB) and camelCase (ORM)
            const realInvested = Number(
              bet.totalInvested || bet.total_invested || 0
            );

            // Fallback for very old legacy data (before re-index)
            const costBasis =
              realInvested > 0 ? realInvested : (yesShares + noShares) * 0.5;

            // 🟢 FIX 2: Capture Claim Status
            const claimed = Boolean(bet.hasClaimed || bet.has_claimed || false);

            const currentValue =
              yesShares * market.yesPrice + noShares * market.noPrice;

            return {
              prediction: formattedPrediction,
              marketId: market.marketId.toString(),
              yesShares,
              noShares,
              invested: costBasis,
              currentValue: currentValue,
              profitLoss: currentValue - costBasis,
              status: market.status || 1,
              outcome: market.outcome,
              hasClaimed: claimed, // 🟢 Store it
            };
          })
          .filter(Boolean);

        setPositions(activePositions);
      } catch (error) {
        console.error("Error fetching portfolio", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [address]);

  // 2. Claim Logic
  const handleClaim = async (marketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!account) return;

    setClaimingId(marketId);
    try {
      const tx = await account.execute({
        contractAddress: import.meta.env.VITE_HUB_ADDRESS,
        entrypoint: "claim_winnings",
        calldata: CallData.compile([marketId]),
      });

      toast.success("Winnings Claimed!", {
        description: "Transaction submitted. Your balance will update shortly.",
      });

      // Optimistic Update: Hide button immediately
      setPositions((prev) =>
        prev.map((p) =>
          p.marketId === marketId ? { ...p, hasClaimed: true } : p
        )
      );
    } catch (err: any) {
      console.error("Claim Error:", err);
      toast.error("Claim Failed", { description: err.message });
    } finally {
      setClaimingId(null);
    }
  };

  // 3. Helper for Status (Won/Lost/Active/Claimed)
  const getPositionStatus = (pos: UserPosition) => {
    if (pos.status === 1) return { type: "active", label: "Active" };

    const userWonYes = pos.outcome === true && pos.yesShares > 0;
    const userWonNo = pos.outcome === false && pos.noShares > 0;

    if (userWonYes || userWonNo) {
      // 🟢 FIX 3: Check if already claimed
      if (pos.hasClaimed) {
        return { type: "claimed", label: "Claimed", canClaim: false };
      }
      return { type: "won", label: "Won", canClaim: true };
    }
    return { type: "lost", label: "Lost" };
  };

  // 4. Calculations
  const totalInvested = positions.reduce((sum, p) => sum + p.invested, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalProfitLoss = positions.reduce((sum, p) => sum + p.profitLoss, 0);
  const profitLossPercent =
    totalInvested > 0
      ? ((totalProfitLoss / totalInvested) * 100).toFixed(2)
      : "0.00";

  // --- UI ---
  if (!address) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-10 flex flex-col items-center">
          <Wallet className="w-12 h-12 text-[#1F87FC] mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Connect to View Portfolio
          </h2>
          <button
            onClick={() => connectWallet()}
            className="bg-[#1F87FC] text-white px-6 py-2 rounded-lg mt-4 font-bold"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-foreground mb-2 text-2xl font-bold">Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            Track your prediction investments
          </p>
        </div>
        {loading && <Loader2 className="w-5 h-5 text-[#1F87FC] animate-spin" />}
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#1F87FC]" />
            <div className="text-xs text-muted-foreground">Total Invested</div>
          </div>
          <div className="text-2xl text-foreground">
            ${totalInvested.toFixed(2)}
          </div>
        </div>
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-[#1F87FC]" />
            <div className="text-xs text-muted-foreground">Current Value</div>
          </div>
          <div className="text-2xl text-foreground">
            ${totalValue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* P&L Summary */}
      {totalInvested > 0 && (
        <div
          className={`rounded-lg p-5 mb-6 border ${
            totalProfitLoss >= 0
              ? "bg-[#00ff88]/10 border-[#00ff88]/30"
              : "bg-[#ff3366]/10 border-[#ff3366]/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="w-5 h-5 text-[#00ff88]" />
              ) : (
                <TrendingDown className="w-5 h-5 text-[#ff3366]" />
              )}
              <span className="text-muted-foreground">Total Profit/Loss</span>
            </div>
            <div
              className={`text-2xl ${
                totalProfitLoss >= 0 ? "text-[#00ff88]" : "text-[#ff3366]"
              }`}
            >
              {totalProfitLoss >= 0 ? "+" : ""}
              {totalProfitLoss.toFixed(2)} ({profitLossPercent}%)
            </div>
          </div>
        </div>
      )}

      {/* Positions */}
      <h3 className="text-foreground mb-4 font-bold text-lg">
        Active Positions
      </h3>

      {!loading && positions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No active positions yet</p>
          <p className="text-sm">Start trading to build your portfolio</p>
        </div>
      ) : (
        <div className="space-y-4">
          {positions.map((position) => {
            const status = getPositionStatus(position);

            return (
              <div
                key={position.marketId}
                className={`bg-[#0f0f1a] border rounded-xl p-5 transition-all ${
                  status.type === "won" && !position.hasClaimed
                    ? "border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.1)]"
                    : status.type === "claimed"
                    ? "border-[#00ff88]/20"
                    : "border-[#1F87FC]/30 hover:border-[#1F87FC]/60"
                }`}
              >
                {/* Prediction Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-12 flex-shrink-0">
                    <MediaPreview
                      src={position.prediction.media.url}
                      type={
                        position.prediction.media.type === "video"
                          ? "video"
                          : undefined
                      }
                      alt="prediction"
                      className="w-full h-full rounded-lg border border-border"
                    />
                  </div>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onViewMarket(position.marketId)}
                  >
                    <p className="text-foreground mb-1 line-clamp-2">
                      {position.prediction.question}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {position.prediction.creator.name}
                      </span>

                      {/* Status Badges */}
                      {status.type === "won" && (
                        <span className="text-[10px] font-bold text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.5 rounded border border-[#00ff88]/20">
                          WON
                        </span>
                      )}
                      {status.type === "claimed" && (
                        <span className="text-[10px] font-bold text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.5 rounded border border-[#00ff88]/20 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> CLAIMED
                        </span>
                      )}
                      {status.type === "lost" && (
                        <span className="text-[10px] font-bold text-[#ff3366] bg-[#ff3366]/10 px-1.5 py-0.5 rounded border border-[#ff3366]/20">
                          LOST
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shares Grid */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {position.yesShares > 0 && (
                    <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        YES Shares
                      </div>
                      <div className="text-[#00ff88] font-mono">
                        {position.yesShares.toFixed(4)}
                      </div>
                    </div>
                  )}
                  {position.noShares > 0 && (
                    <div className="bg-[#ff3366]/10 border border-[#ff3366]/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        NO Shares
                      </div>
                      <div className="text-[#ff3366] font-mono">
                        {position.noShares.toFixed(4)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer: Financials OR Claim Button */}
                <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
                  <div className="text-muted-foreground">
                    Invested:{" "}
                    <span className="text-foreground">
                      ${position.invested.toFixed(2)}
                    </span>
                  </div>

                  {/* 🟢 CONDITIONAL FOOTER: Show Claim Button ONLY if won & NOT claimed */}
                  {status.canClaim ? (
                    <button
                      onClick={(e) => handleClaim(position.marketId, e)}
                      disabled={claimingId === position.marketId}
                      className="flex items-center gap-2 bg-[#00ff88] text-black px-4 py-1.5 rounded-md text-xs font-bold hover:bg-[#00ff88]/90 transition-colors shadow-[0_0_10px_rgba(0,255,136,0.3)] disabled:opacity-50"
                    >
                      {claimingId === position.marketId ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trophy className="w-3 h-3" />
                      )}
                      {claimingId === position.marketId
                        ? "Claiming..."
                        : "CLAIM WINNINGS"}
                    </button>
                  ) : (
                    <>
                      <div className="text-muted-foreground">
                        Value:{" "}
                        <span className="text-foreground">
                          ${position.currentValue.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className={
                          position.profitLoss >= 0
                            ? "text-[#00ff88]"
                            : "text-[#ff3366]"
                        }
                      >
                        {position.profitLoss >= 0 ? "+" : ""}
                        {position.profitLoss.toFixed(2)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
