import { useState } from 'react';
import { User, TrendingUp, Users, Grid, BarChart3, Zap, Edit, X, Camera } from 'lucide-react';
import { mockPredictions } from '../data/mockData';
import { getUserLevel } from '../data/gamificationData';
import { toast } from 'sonner@2.0.3';

type ProfileTab = 'predictions' | 'investments' | 'media';

export function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('predictions');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: 'CyberTrader',
    username: '@cybertrader',
    bio: 'Professional prediction trader | Tech enthusiast | Blockchain believer',
  });

  const userStats = {
    predictions: 24,
    investments: 156,
    followers: 1247,
    following: 342,
    winRate: 68,
    totalProfit: 1234.56,
    xp: 4234,
  };

  const currentLevel = getUserLevel(userStats.xp);

  const handleSave = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      displayName: 'CyberTrader',
      username: '@cybertrader',
      bio: 'Professional prediction trader | Tech enthusiast | Blockchain believer',
    });
    setProfilePic(null);
    setIsEditing(false);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'predictions' as ProfileTab, label: 'Predictions', icon: Grid },
    { id: 'investments' as ProfileTab, label: 'Investments', icon: BarChart3 },
    { id: 'media' as ProfileTab, label: 'Media', icon: Grid },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
        {/* Edit Button */}
        <div className="flex justify-end mb-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1F87FC]/10 border border-[#1F87FC]/40 rounded-lg text-[#1F87FC] hover:bg-[#1F87FC]/20 transition-all text-xs md:text-sm"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0f] border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all text-xs md:text-sm"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1F87FC] border border-[#1F87FC] rounded-lg text-white hover:bg-[#1F87FC]/90 transition-all text-xs md:text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#1F87FC] to-[#00ffcc] flex items-center justify-center border-2 border-[#1F87FC] flex-shrink-0 relative group">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
            )}
            
            {/* Edit Profile Picture Overlay - Only in Edit Mode */}
            {isEditing && (
              <>
                <input
                  type="file"
                  id="profile-pic-input"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
                <label
                  htmlFor="profile-pic-input"
                  className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </label>
              </>
            )}
            
            {/* Level Badge */}
            <div className="absolute -bottom-1 -right-1 bg-[#0a0a0f] border-2 border-[#1F87FC] rounded-full px-2 py-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#1F87FC]" />
              <span className="text-xs text-[#1F87FC]">{currentLevel.level}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {!isEditing ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-foreground text-lg md:text-xl">{formData.displayName}</h2>
                  <div className="px-2 py-0.5 bg-gradient-to-r from-[#1F87FC]/20 to-[#00ff88]/20 border border-[#1F87FC]/40 rounded text-xs flex items-center gap-1">
                    <span>{currentLevel.icon}</span>
                    <span style={{ color: currentLevel.color }}>{currentLevel.name}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-3">{formData.username}</p>
                <p className="text-foreground text-xs md:text-sm">{formData.bio}</p>
              </>
            ) : (
              <div className="space-y-3">
                {/* Display Name */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-[#1F87FC]/30 rounded-lg px-3 py-2 text-foreground text-sm focus:border-[#1F87FC] focus:outline-none transition-all"
                    placeholder="Enter display name"
                  />
                </div>
                
                {/* Username */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-[#1F87FC]/30 rounded-lg px-3 py-2 text-foreground text-sm focus:border-[#1F87FC] focus:outline-none transition-all"
                    placeholder="Enter username"
                  />
                </div>
                
                {/* Bio */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full bg-[#0a0a0f] border border-[#1F87FC]/30 rounded-lg px-3 py-2 text-foreground text-sm focus:border-[#1F87FC] focus:outline-none transition-all resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="text-center">
            <div className="text-xl md:text-2xl text-[#1F87FC]">{userStats.predictions}</div>
            <div className="text-xs text-muted-foreground">Predictions</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl text-[#1F87FC]">{userStats.investments}</div>
            <div className="text-xs text-muted-foreground">Investments</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl text-[#1F87FC]">{userStats.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl text-[#1F87FC]">{userStats.following}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-[#0f0f1a] border border-[#00ff88]/30 rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#00ff88]" />
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-xl md:text-2xl text-[#00ff88]">{userStats.winRate}%</div>
        </div>
        <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[#1F87FC]" />
            <div className="text-xs text-muted-foreground">Total Profit</div>
          </div>
          <div className="text-xl md:text-2xl text-[#1F87FC]">${userStats.totalProfit}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 md:mb-6 border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? 'border-[#1F87FC] text-[#1F87FC]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-xs md:text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'predictions' && (
          <div className="grid grid-cols-2 gap-3 md:gap-4">
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
                <div className="p-2 md:p-3">
                  <p className="text-xs md:text-sm text-foreground line-clamp-2 mb-2">{prediction.question}</p>
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
            <BarChart3 className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
            <p className="text-xs md:text-sm">Investment history will appear here</p>
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