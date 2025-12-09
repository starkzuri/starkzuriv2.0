import { useState } from 'react';
import { PredictionCard } from './PredictionCard';
import { mockPredictions } from '../data/mockData';
import { Sparkles } from 'lucide-react';

interface HomeFeedProps {
  onViewMarket: (id: string) => void;
}

export function HomeFeed({ onViewMarket }: HomeFeedProps) {
  const [predictions, setPredictions] = useState(mockPredictions);

  const handleLike = (id: string) => {
    setPredictions(prev => prev.map(p => 
      p.id === id 
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
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

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-[#1F87FC]" />
        <div>
          <h1 className="text-foreground">Prediction Feed</h1>
          <p className="text-sm text-muted-foreground">Trade on what you believe</p>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {predictions.map(prediction => (
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
        ))}
      </div>
    </div>
  );
}