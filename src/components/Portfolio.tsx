import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { mockUserPositions } from '../data/mockData';

export function Portfolio() {
  const [positions] = useState(mockUserPositions);

  const totalInvested = positions.reduce((sum, p) => sum + p.invested, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalProfitLoss = positions.reduce((sum, p) => sum + p.profitLoss, 0);
  const profitLossPercent = ((totalProfitLoss / totalInvested) * 100).toFixed(2);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-foreground mb-2">Portfolio</h1>
        <p className="text-sm text-muted-foreground">Track your prediction investments</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#1F87FC]" />
            <div className="text-xs text-muted-foreground">Total Invested</div>
          </div>
          <div className="text-2xl text-foreground">${totalInvested.toFixed(2)}</div>
        </div>
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-[#1F87FC]" />
            <div className="text-xs text-muted-foreground">Current Value</div>
          </div>
          <div className="text-2xl text-foreground">${totalValue.toFixed(2)}</div>
        </div>
      </div>

      {/* P&L Summary */}
      <div className={`rounded-lg p-5 mb-6 border ${
        totalProfitLoss >= 0 
          ? 'bg-[#00ff88]/10 border-[#00ff88]/30' 
          : 'bg-[#ff3366]/10 border-[#ff3366]/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {totalProfitLoss >= 0 ? (
              <TrendingUp className="w-5 h-5 text-[#00ff88]" />
            ) : (
              <TrendingDown className="w-5 h-5 text-[#ff3366]" />
            )}
            <span className="text-muted-foreground">Total Profit/Loss</span>
          </div>
          <div className={`text-2xl ${totalProfitLoss >= 0 ? 'text-[#00ff88]' : 'text-[#ff3366]'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)} ({profitLossPercent}%)
          </div>
        </div>
      </div>

      {/* Positions */}
      <h3 className="text-foreground mb-4">Active Positions</h3>
      <div className="space-y-4">
        {positions.map(position => (
          <div
            key={position.predictionId}
            className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-5 hover:border-[#1F87FC]/60 transition-all"
          >
            {/* Prediction Info */}
            <div className="flex items-start gap-3 mb-4">
              <img 
                src={position.prediction.media.url} 
                alt="prediction"
                className="w-16 h-16 rounded-lg object-cover border border-border"
              />
              <div className="flex-1 min-w-0">
                <p className="text-foreground mb-1 line-clamp-2">{position.prediction.question}</p>
                <div className="text-xs text-muted-foreground">{position.prediction.creator.name}</div>
              </div>
            </div>

            {/* Position Details */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              {position.yesShares > 0 && (
                <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">YES Shares</div>
                  <div className="text-[#00ff88]">{position.yesShares}</div>
                </div>
              )}
              {position.noShares > 0 && (
                <div className="bg-[#ff3366]/10 border border-[#ff3366]/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">NO Shares</div>
                  <div className="text-[#ff3366]">{position.noShares}</div>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
              <div className="text-muted-foreground">
                Invested: <span className="text-foreground">${position.invested.toFixed(2)}</span>
              </div>
              <div className="text-muted-foreground">
                Value: <span className="text-foreground">${position.currentValue.toFixed(2)}</span>
              </div>
              <div className={position.profitLoss >= 0 ? 'text-[#00ff88]' : 'text-[#ff3366]'}>
                {position.profitLoss >= 0 ? '+' : ''}{position.profitLoss.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {positions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No active positions yet</p>
          <p className="text-sm">Start trading to build your portfolio</p>
        </div>
      )}
    </div>
  );
}
