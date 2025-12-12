import { useState } from 'react';
import { Trophy, Award, Zap, TrendingUp, Target, Flame, Crown, Star } from 'lucide-react';
import { mockAchievements, mockLeaderboard, mockDailyStreak, getUserLevel, LEVELS } from '../data/gamificationData';

type RewardsTab = 'overview' | 'achievements' | 'leaderboard';

export function Rewards() {
  const [activeTab, setActiveTab] = useState<RewardsTab>('overview');
  
  const userXp = 4234;
  const currentLevel = getUserLevel(userXp);
  const nextLevel = LEVELS[currentLevel.level];
  const xpProgress = nextLevel ? ((userXp - currentLevel.xp) / (nextLevel.xpToNextLevel)) * 100 : 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6b6b7f';
      case 'rare': return '#1F87FC';
      case 'epic': return '#9333ea';
      case 'legendary': return '#ffd700';
      default: return '#6b6b7f';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-[#6b6b7f]/40';
      case 'rare': return 'border-[#1F87FC]/40';
      case 'epic': return 'border-[#9333ea]/40';
      case 'legendary': return 'border-[#ffd700]/40';
      default: return 'border-[#6b6b7f]/40';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 md:w-8 md:h-8 text-[#ffd700]" />
        <div>
          <h1 className="text-foreground text-xl md:text-2xl">Rewards & Ranks</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Level up and earn achievements</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 transition-all relative whitespace-nowrap flex-shrink-0 ${
            activeTab === 'overview'
              ? 'text-[#1F87FC]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Star className="w-4 h-4" />
          <span className="text-xs md:text-sm">Overview</span>
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC] shadow-[0_0_8px_rgba(31,135,252,0.8)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 transition-all relative whitespace-nowrap flex-shrink-0 ${
            activeTab === 'achievements'
              ? 'text-[#1F87FC]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" />
          <span className="text-xs md:text-sm">Achievements</span>
          {activeTab === 'achievements' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC] shadow-[0_0_8px_rgba(31,135,252,0.8)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 transition-all relative whitespace-nowrap flex-shrink-0 ${
            activeTab === 'leaderboard'
              ? 'text-[#1F87FC]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span className="text-xs md:text-sm">Leaderboard</span>
          {activeTab === 'leaderboard' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F87FC] shadow-[0_0_8px_rgba(31,135,252,0.8)]" />
          )}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4 md:space-y-6">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-[#1F87FC]/20 to-transparent border border-[#1F87FC]/40 rounded-xl p-4 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl md:text-5xl">{currentLevel.icon}</div>
                <div>
                  <div className="text-lg md:text-2xl text-foreground">Level {currentLevel.level}</div>
                  <div className="text-sm md:text-base" style={{ color: currentLevel.color }}>{currentLevel.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl md:text-2xl text-[#1F87FC]">{formatNumber(userXp)} XP</div>
                <div className="text-xs text-muted-foreground">
                  {nextLevel && `${formatNumber(nextLevel.xpToNextLevel - (userXp - currentLevel.xp))} to next level`}
                </div>
              </div>
            </div>
            
            {nextLevel && (
              <div>
                <div className="flex items-center justify-between mb-2 text-xs md:text-sm text-muted-foreground">
                  <span>Progress to Level {currentLevel.level + 1}</span>
                  <span>{Math.floor(xpProgress)}%</span>
                </div>
                <div className="w-full h-3 bg-[#1a1a24] rounded-full overflow-hidden border border-[#1F87FC]/30">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1F87FC] to-[#00ffcc] transition-all duration-500 shadow-[0_0_10px_rgba(31,135,252,0.8)]"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Daily Streak */}
          <div className="bg-[#0f0f1a] border border-[#ff3366]/40 rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-6 h-6 md:w-8 md:h-8 text-[#ff3366]" />
              <div className="flex-1">
                <h3 className="text-foreground text-sm md:text-base">Daily Streak</h3>
                <p className="text-xs text-muted-foreground">Login daily to earn bonus XP</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a24] border border-border rounded-lg p-3 md:p-4">
                <div className="text-2xl md:text-3xl text-[#ff3366] mb-1">{mockDailyStreak.currentStreak} days</div>
                <div className="text-xs text-muted-foreground">Current Streak</div>
              </div>
              <div className="bg-[#1a1a24] border border-border rounded-lg p-3 md:p-4">
                <div className="text-2xl md:text-3xl text-[#1F87FC] mb-1">+{mockDailyStreak.xpBonus} XP</div>
                <div className="text-xs text-muted-foreground">Daily Bonus</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-[#0f0f1a] border border-[#00ff88]/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#00ff88]" />
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
              <div className="text-xl md:text-2xl text-[#00ff88]">{mockAchievements.filter(a => a.completed).length}/{mockAchievements.length}</div>
            </div>
            <div className="bg-[#0f0f1a] border border-[#ffd700]/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-[#ffd700]" />
                <div className="text-xs text-muted-foreground">Leaderboard Rank</div>
              </div>
              <div className="text-xl md:text-2xl text-[#ffd700]">#5</div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h3 className="text-foreground mb-3 text-sm md:text-base">Recent Achievements</h3>
            <div className="space-y-3">
              {mockAchievements.filter(a => a.completed).slice(0, 3).map(achievement => (
                <div key={achievement.id} className={`bg-[#0f0f1a] border ${getRarityBorder(achievement.rarity)} rounded-lg p-3 md:p-4 flex items-center gap-3`}>
                  <div className="text-2xl md:text-3xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-foreground text-sm md:text-base">{achievement.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${getRarityColor(achievement.rarity)}20`, color: getRarityColor(achievement.rarity), border: `1px solid ${getRarityColor(achievement.rarity)}40` }}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <div className="text-[#1F87FC] text-sm md:text-base">+{achievement.xpReward} XP</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-3 md:space-y-4">
          {mockAchievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`bg-[#0f0f1a] border ${getRarityBorder(achievement.rarity)} rounded-xl p-4 md:p-6 ${
                achievement.completed ? 'opacity-100' : 'opacity-60'
              } transition-all hover:border-[#1F87FC]/60`}
            >
              <div className="flex items-start gap-3 md:gap-4 mb-3">
                <div className="text-3xl md:text-4xl">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-foreground text-sm md:text-base">{achievement.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${getRarityColor(achievement.rarity)}20`, color: getRarityColor(achievement.rarity), border: `1px solid ${getRarityColor(achievement.rarity)}40` }}>
                      {achievement.rarity}
                    </span>
                    {achievement.completed && (
                      <span className="text-xs px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40 rounded">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  
                  {!achievement.completed && (
                    <div>
                      <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.total}</span>
                      </div>
                      <div className="w-full h-2 bg-[#1a1a24] rounded-full overflow-hidden border border-border">
                        <div 
                          className="h-full transition-all duration-500"
                          style={{ 
                            width: `${(achievement.progress / achievement.total) * 100}%`,
                            backgroundColor: getRarityColor(achievement.rarity),
                            boxShadow: `0 0 10px ${getRarityColor(achievement.rarity)}80`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[#1F87FC] text-sm md:text-base">+{achievement.xpReward}</div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          {mockLeaderboard.map((user, index) => {
            const isCurrentUser = user.username === '@cybertrader';
            const userLevel = getUserLevel(user.xp);
            
            return (
              <div 
                key={user.username} 
                className={`bg-[#0f0f1a] border rounded-lg p-3 md:p-4 flex items-center gap-3 md:gap-4 transition-all hover:border-[#1F87FC]/60 ${
                  isCurrentUser ? 'border-[#1F87FC]/60 bg-[#1F87FC]/5' : 'border-border'
                }`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-8 md:w-10">
                  {user.rank === 1 && <div className="text-2xl md:text-3xl">🥇</div>}
                  {user.rank === 2 && <div className="text-2xl md:text-3xl">🥈</div>}
                  {user.rank === 3 && <div className="text-2xl md:text-3xl">🥉</div>}
                  {user.rank > 3 && <div className="text-foreground text-sm md:text-base">#{user.rank}</div>}
                </div>

                {/* Avatar */}
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#1F87FC]/40 flex-shrink-0"
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-foreground text-sm md:text-base truncate">{user.name}</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-[#1a1a24] border border-border rounded text-xs flex-shrink-0">
                      <span>{userLevel.icon}</span>
                      <span className="text-muted-foreground">Lv{user.level}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>{formatNumber(user.xp)} XP</div>
                    <div>{user.winRate}% Win Rate</div>
                  </div>
                </div>

                {/* Profit */}
                <div className="text-right flex-shrink-0">
                  <div className="text-[#00ff88] text-sm md:text-base">${formatNumber(user.totalProfit)}</div>
                  <div className="text-xs text-muted-foreground">Profit</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
