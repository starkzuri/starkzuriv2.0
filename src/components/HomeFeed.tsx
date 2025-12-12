import { useState } from 'react';
import { PredictionCard } from './PredictionCard';
import { mockPredictions } from '../data/mockData';
import { Sparkles, Users } from 'lucide-react';

interface HomeFeedProps {
  onViewMarket: (id: string) => void;
}

type FeedTab = 'for-you' | 'following';

export function HomeFeed({ onViewMarket }: HomeFeedProps) {
  const [predictions, setPredictions] = useState(mockPredictions);
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');

  const handleLike = (id: string) => {
    setPredictions(predictions.map(p => 
      p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handleComment = (id: string) => {
    console.log('Comment on:', id);
  };

  const handleRepost = (id: string) => {
    console.log('Repost:', id);
  };

  const handleBuyYes = (id: string) => {
    console.log('Buy YES:', id);
  };

  const handleBuyNo = (id: string) => {
    console.log('Buy NO:', id);
  };

  // Filter predictions based on active tab
  const getFilteredPredictions = () => {
    if (activeTab === 'following') {
      // Show predictions from followed users (for demo, show first 3)
      return predictions.slice(0, 3);
    }
    // For You - personalized feed showing all
    return predictions;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-[#1F87FC]" />
        <div>
          <h1 className="text-foreground">Home</h1>
          <p className="text-sm text-muted-foreground">Your personalized feed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('for-you')}
          className={`flex-1 pb-3 px-4 transition-all relative ${
            activeTab === 'for-you'
              ? 'text-[#1F87FC]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>For You</span>
          </div>
          {activeTab === 'for-you' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC] shadow-[0_0_8px_rgba(31,135,252,0.8)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 pb-3 px-4 transition-all relative ${
            activeTab === 'following'
              ? 'text-[#1F87FC]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            <span>Following</span>
          </div>
          {activeTab === 'following' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC] shadow-[0_0_8px_rgba(31,135,252,0.8)]" />
          )}
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {getFilteredPredictions().length === 0 ? (
          <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-foreground mb-2">No predictions yet</h3>
            <p className="text-sm text-muted-foreground">
              Follow creators to see their predictions here
            </p>
          </div>
        ) : (
          getFilteredPredictions().map(prediction => (
            <PredictionCard
              key={prediction.id}
              prediction={prediction}
              onLike={handleLike}
              onComment={handleComment}
              onRepost={handleRepost}
              onBuyYes={handleBuyYes}
              onBuyNo={handleBuyNo}
              onClick={onViewMarket}
            />
          ))
        )}
      </div>
    </div>
  );
}