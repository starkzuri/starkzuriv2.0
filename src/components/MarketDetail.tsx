import { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Repeat2, Clock, TrendingUp, TrendingDown, Share2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Prediction, Comment } from '../types/prediction';
import { generatePriceHistory, mockComments } from '../data/mockData';

interface MarketDetailProps {
  prediction: Prediction;
  onBack: () => void;
}

export function MarketDetail({ prediction, onBack }: MarketDetailProps) {
  const [activeChart, setActiveChart] = useState<'yes' | 'no' | 'both'>('both');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments[prediction.id] || []);
  
  const priceHistory = generatePriceHistory(prediction.id);

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(prediction.endsAt);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: {
        name: 'You',
        username: '@you',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      },
      text: commentText,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/40 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">
            {new Date(payload[0].payload.timestamp).toLocaleDateString()}
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: entry.color }} />
              <span className="text-sm" style={{ color: entry.color }}>
                {entry.name}: ${entry.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#1F87FC] hover:text-[#1F87FC]/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Feed</span>
      </button>

      {/* Main Card */}
      <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl overflow-hidden">
        {/* Creator Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img 
              src={prediction.creator.avatar} 
              alt={prediction.creator.name}
              className="w-12 h-12 rounded-full border border-[#1F87FC]/40"
            />
            <div>
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
          <button className="text-muted-foreground hover:text-[#1F87FC] transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Media - Larger */}
        <div className="relative aspect-video bg-black/40 overflow-hidden">
          {prediction.media.type === 'image' && (
            <img 
              src={prediction.media.url} 
              alt="Prediction media"
              className="w-full h-full object-cover"
            />
          )}
          {prediction.media.type === 'video' && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F87FC]/10 to-transparent">
              <div className="text-[#1F87FC] text-6xl">▶</div>
            </div>
          )}
        </div>

        {/* Question & Stats */}
        <div className="p-6 space-y-6">
          <h2 className="text-foreground">{prediction.question}</h2>

          {/* Market Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#1a1a24] border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Total Volume</div>
              <div className="text-xl text-[#1F87FC]">${formatNumber(prediction.totalVolume)}</div>
            </div>
            <div className="bg-[#1a1a24] border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">YES Shares</div>
              <div className="text-xl text-[#00ff88]">{formatNumber(prediction.yesShares)}</div>
            </div>
            <div className="bg-[#1a1a24] border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">NO Shares</div>
              <div className="text-xl text-[#ff3366]">{formatNumber(prediction.noShares)}</div>
            </div>
            <div className="bg-[#1a1a24] border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Traders</div>
              <div className="text-xl text-[#1F87FC]">{formatNumber(Math.floor(prediction.totalVolume / 100))}</div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground">Price History</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveChart('both')}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    activeChart === 'both'
                      ? 'bg-[#1F87FC]/20 border border-[#1F87FC] text-[#1F87FC]'
                      : 'border border-border text-muted-foreground hover:border-[#1F87FC]/40'
                  }`}
                >
                  Both
                </button>
                <button
                  onClick={() => setActiveChart('yes')}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    activeChart === 'yes'
                      ? 'bg-[#00ff88]/20 border border-[#00ff88] text-[#00ff88]'
                      : 'border border-border text-muted-foreground hover:border-[#00ff88]/40'
                  }`}
                >
                  YES
                </button>
                <button
                  onClick={() => setActiveChart('no')}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    activeChart === 'no'
                      ? 'bg-[#ff3366]/20 border border-[#ff3366] text-[#ff3366]'
                      : 'border border-border text-muted-foreground hover:border-[#ff3366]/40'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            <div className="bg-[#1a1a24] border border-border rounded-lg p-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff3366" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 135, 252, 0.1)" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#6b6b7f"
                    tick={{ fill: '#6b6b7f', fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#6b6b7f"
                    tick={{ fill: '#6b6b7f', fontSize: 12 }}
                    domain={[0, 1]}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {(activeChart === 'both' || activeChart === 'yes') && (
                    <Area
                      type="monotone"
                      dataKey="yesPrice"
                      stroke="#00ff88"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorYes)"
                      name="YES"
                    />
                  )}
                  {(activeChart === 'both' || activeChart === 'no') && (
                    <Area
                      type="monotone"
                      dataKey="noPrice"
                      stroke="#ff3366"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNo)"
                      name="NO"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trading Interface */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#00ff88]/20 to-transparent border border-[#00ff88]/40 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">BUY YES</div>
                  <div className="text-3xl text-[#00ff88]">${prediction.yesPrice.toFixed(2)}</div>
                </div>
                <TrendingUp className="w-8 h-8 text-[#00ff88]" />
              </div>
              <input
                type="number"
                placeholder="Amount"
                className="w-full bg-[#1a1a24] border border-[#00ff88]/30 rounded px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00ff88] mb-3"
              />
              <button className="w-full bg-[#00ff88] text-black py-3 rounded-lg hover:bg-[#00ff88]/90 transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]">
                Buy YES Shares
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#ff3366]/20 to-transparent border border-[#ff3366]/40 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">BUY NO</div>
                  <div className="text-3xl text-[#ff3366]">${prediction.noPrice.toFixed(2)}</div>
                </div>
                <TrendingDown className="w-8 h-8 text-[#ff3366]" />
              </div>
              <input
                type="number"
                placeholder="Amount"
                className="w-full bg-[#1a1a24] border border-[#ff3366]/30 rounded px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#ff3366] mb-3"
              />
              <button className="w-full bg-[#ff3366] text-white py-3 rounded-lg hover:bg-[#ff3366]/90 transition-all hover:shadow-[0_0_20px_rgba(255,51,102,0.5)]">
                Buy NO Shares
              </button>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <button className={`flex items-center gap-2 transition-colors ${
              prediction.isLiked ? 'text-[#ff3366]' : 'text-muted-foreground hover:text-[#1F87FC]'
            }`}>
              <Heart className={`w-5 h-5 ${prediction.isLiked ? 'fill-current' : ''}`} />
              <span>{formatNumber(prediction.likes)}</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{formatNumber(prediction.comments)}</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-[#1F87FC] transition-colors">
              <Repeat2 className="w-5 h-5" />
              <span>{formatNumber(prediction.reposts)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-6">
        <h3 className="text-foreground mb-4">Comments ({comments.length})</h3>

        {/* Comment Input */}
        <div className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-[#1a1a24] border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#1F87FC] focus:ring-1 focus:ring-[#1F87FC] transition-colors resize-none"
            rows={3}
          />
          <button
            onClick={handlePostComment}
            className="mt-2 px-6 py-2 bg-[#1F87FC] text-white rounded-lg hover:bg-[#1F87FC]/90 transition-all hover:shadow-[0_0_20px_rgba(31,135,252,0.5)]"
          >
            Post Comment
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 p-4 bg-[#1a1a24] border border-border rounded-lg hover:border-[#1F87FC]/40 transition-colors">
              <img 
                src={comment.user.avatar} 
                alt={comment.user.name}
                className="w-10 h-10 rounded-full border border-[#1F87FC]/40"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-foreground">{comment.user.name}</span>
                  <span className="text-muted-foreground text-sm">{comment.user.username}</span>
                  <span className="text-muted-foreground text-xs">• {formatTime(comment.timestamp)}</span>
                </div>
                <p className="text-foreground mb-2">{comment.text}</p>
                <button className={`flex items-center gap-1 text-sm transition-colors ${
                  comment.isLiked ? 'text-[#ff3366]' : 'text-muted-foreground hover:text-[#1F87FC]'
                }`}>
                  <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                  <span>{comment.likes > 0 ? comment.likes : ''}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
