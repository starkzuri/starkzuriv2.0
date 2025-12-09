import { useState } from 'react';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { mockPredictions } from '../data/mockData';
import { PredictionCard } from './PredictionCard';

type MarketView = 'trending' | 'rising-yes' | 'rising-no' | 'new';

interface MarketExploreProps {
  onViewMarket: (id: string) => void;
}

export function MarketExplore({ onViewMarket }: MarketExploreProps) {
  const [activeView, setActiveView] = useState<MarketView>('trending');
  const [predictions] = useState(mockPredictions);

  const filteredPredictions = () => {
    switch (activeView) {
      case 'trending':
        return [...predictions].sort((a, b) => b.totalVolume - a.totalVolume);
      case 'rising-yes':
        return [...predictions].sort((a, b) => b.yesPrice - a.yesPrice);
      case 'rising-no':
        return [...predictions].sort((a, b) => b.noPrice - a.noPrice);
      case 'new':
        return [...predictions].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return predictions;
    }
  };

  const tabs = [
    { id: 'trending' as MarketView, label: 'Trending', icon: Sparkles },
    { id: 'rising-yes' as MarketView, label: 'Rising YES', icon: TrendingUp },
    { id: 'rising-no' as MarketView, label: 'Rising NO', icon: TrendingDown },
    { id: 'new' as MarketView, label: 'New', icon: Sparkles },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-foreground mb-2">Explore Markets</h1>
        <p className="text-sm text-muted-foreground">Discover trending predictions and opportunities</p>
      </div>

      {/* Market Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border whitespace-nowrap transition-all ${
              activeView === tab.id
                ? 'bg-[#1F87FC]/20 border-[#1F87FC] text-[#1F87FC]'
                : 'border-border text-muted-foreground hover:border-[#1F87FC]/40'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Total Volume</div>
          <div className="text-xl text-[#1F87FC]">$2.4M</div>
        </div>
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Active Markets</div>
          <div className="text-xl text-[#1F87FC]">1,248</div>
        </div>
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Traders</div>
          <div className="text-xl text-[#1F87FC]">45.2K</div>
        </div>
      </div>

      {/* Predictions Feed */}
      <div className="space-y-6">
        {filteredPredictions().map(prediction => (
          <PredictionCard 
            key={prediction.id} 
            prediction={prediction}
            onClick={onViewMarket}
          />
        ))}
      </div>
    </div>
  );
}