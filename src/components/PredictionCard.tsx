import { Heart, MessageCircle, Repeat2, Clock } from 'lucide-react';
import { Prediction } from '../types/prediction';

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
  onBuyYes, 
  onBuyNo,
  onClick
}: PredictionCardProps) {
  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(prediction.endsAt);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
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

  return (
    <div 
      className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#1F87FC]/60 hover:shadow-[0_0_20px_rgba(31,135,252,0.3)] cursor-pointer"
      onClick={() => onClick?.(prediction.id)}
    >
      {/* Creator Header */}
      <div className="flex items-center gap-3 p-4">
        <img 
          src={prediction.creator.avatar} 
          alt={prediction.creator.name}
          className="w-10 h-10 rounded-full border border-[#1F87FC]/40"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground">{prediction.creator.name}</span>
            <span className="text-muted-foreground text-sm">{prediction.creator.username}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 bg-[#1F87FC]/10 border border-[#1F87FC]/30 rounded">{prediction.category}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{getTimeRemaining()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
        {prediction.media.type === 'image' && (
          <img 
            src={prediction.media.url} 
            alt="Prediction media"
            className="w-full h-full object-cover"
          />
        )}
        {prediction.media.type === 'video' && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F87FC]/10 to-transparent">
            <div className="text-[#1F87FC] text-4xl">▶</div>
          </div>
        )}
        {prediction.media.type === 'audio' && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F87FC]/10 to-transparent">
            <div className="flex gap-1 items-end">
              {Array.from({ length: 40 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-1 bg-[#1F87FC] rounded-full"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="p-4">
        <h3 className="text-foreground mb-4">{prediction.question}</h3>

        {/* YES/NO Market */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* BUY YES */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyYes?.(prediction.id);
            }}
            className="bg-gradient-to-br from-[#00ff88]/20 to-transparent border border-[#00ff88]/40 rounded-lg p-4 transition-all duration-300 hover:border-[#00ff88] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] group"
          >
            <div className="text-xs text-muted-foreground mb-1">BUY YES</div>
            <div className="text-2xl text-[#00ff88] mb-1">${prediction.yesPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">{formatNumber(prediction.yesShares)} shares</div>
          </button>

          {/* BUY NO */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNo?.(prediction.id);
            }}
            className="bg-gradient-to-br from-[#ff3366]/20 to-transparent border border-[#ff3366]/40 rounded-lg p-4 transition-all duration-300 hover:border-[#ff3366] hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] group"
          >
            <div className="text-xs text-muted-foreground mb-1">BUY NO</div>
            <div className="text-2xl text-[#ff3366] mb-1">${prediction.noPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">{formatNumber(prediction.noShares)} shares</div>
          </button>
        </div>

        {/* Social Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(prediction.id);
            }}
            className={`flex items-center gap-2 transition-colors ${
              prediction.isLiked ? 'text-[#ff3366]' : 'text-muted-foreground hover:text-[#1F87FC]'
            }`}
          >
            <Heart className={`w-5 h-5 ${prediction.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{formatNumber(prediction.likes)}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComment?.(prediction.id);
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{formatNumber(prediction.comments)}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRepost?.(prediction.id);
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors"
          >
            <Repeat2 className="w-5 h-5" />
            <span className="text-sm">{formatNumber(prediction.reposts)}</span>
          </button>
          <div className="ml-auto text-xs text-muted-foreground">
            Vol: ${formatNumber(prediction.totalVolume)}
          </div>
        </div>
      </div>
    </div>
  );
}