import { useState } from 'react';
import { User, TrendingUp, Users, Grid, BarChart3 } from 'lucide-react';
import { mockPredictions } from '../data/mockData';

type ProfileTab = 'predictions' | 'investments' | 'media';

export function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('predictions');

  const userStats = {
    predictions: 24,
    investments: 156,
    followers: 1247,
    following: 342,
    winRate: 68,
    totalProfit: 1234.56,
  };

  const tabs = [
    { id: 'predictions' as ProfileTab, label: 'Predictions', icon: Grid },
    { id: 'investments' as ProfileTab, label: 'Investments', icon: BarChart3 },
    { id: 'media' as ProfileTab, label: 'Media', icon: Grid },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1F87FC] to-[#00ffcc] flex items-center justify-center border-2 border-[#1F87FC]">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-foreground mb-1">CyberTrader</h2>
            <p className="text-muted-foreground text-sm mb-3">@cybertrader</p>
            <p className="text-foreground text-sm">Professional prediction trader | Tech enthusiast | Blockchain believer</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl text-[#1F87FC]">{userStats.predictions}</div>
            <div className="text-xs text-muted-foreground">Predictions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-[#1F87FC]">{userStats.investments}</div>
            <div className="text-xs text-muted-foreground">Investments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-[#1F87FC]">{userStats.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-[#1F87FC]">{userStats.following}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0f0f1a] border border-[#00ff88]/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#00ff88]" />
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-2xl text-[#00ff88]">{userStats.winRate}%</div>
        </div>
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[#1F87FC]" />
            <div className="text-xs text-muted-foreground">Total Profit</div>
          </div>
          <div className="text-2xl text-[#1F87FC]">${userStats.totalProfit}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#1F87FC] text-[#1F87FC]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'predictions' && (
          <div className="grid grid-cols-2 gap-4">
            {mockPredictions.slice(0, 6).map(prediction => (
              <div
                key={prediction.id}
                className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg overflow-hidden hover:border-[#1F87FC]/60 transition-all cursor-pointer"
              >
                <div className="aspect-[4/3] bg-black/40">
                  <img 
                    src={prediction.media.url} 
                    alt={prediction.question}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm text-foreground line-clamp-2 mb-2">{prediction.question}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>${prediction.yesPrice.toFixed(2)} YES</span>
                    <span>${prediction.noPrice.toFixed(2)} NO</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Investment history will appear here</p>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="grid grid-cols-3 gap-2">
            {mockPredictions.slice(0, 9).map(prediction => (
              <div
                key={prediction.id}
                className="aspect-square bg-black/40 rounded-lg overflow-hidden border border-[#1F87FC]/30 hover:border-[#1F87FC]/60 transition-all cursor-pointer"
              >
                <img 
                  src={prediction.media.url} 
                  alt={prediction.question}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
