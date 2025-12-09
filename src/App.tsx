import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { HomeFeed } from './components/HomeFeed';
import { CreatePrediction } from './components/CreatePrediction';
import { MarketExplore } from './components/MarketExplore';
import { Portfolio } from './components/Portfolio';
import { Profile } from './components/Profile';
import { MarketDetail } from './components/MarketDetail';
import { mockPredictions } from './data/mockData';

type Screen = 'home' | 'market' | 'create' | 'portfolio' | 'profile' | 'market-detail';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  const handleViewMarket = (id: string) => {
    setSelectedMarketId(id);
    setActiveScreen('market-detail');
  };

  const handleBackToFeed = () => {
    setActiveScreen('home');
    setSelectedMarketId(null);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeFeed onViewMarket={handleViewMarket} />;
      case 'market':
        return <MarketExplore onViewMarket={handleViewMarket} />;
      case 'create':
        return <CreatePrediction />;
      case 'portfolio':
        return <Portfolio />;
      case 'profile':
        return <Profile />;
      case 'market-detail':
        const prediction = mockPredictions.find(p => p.id === selectedMarketId);
        return prediction ? (
          <MarketDetail prediction={prediction} onBack={handleBackToFeed} />
        ) : (
          <HomeFeed onViewMarket={handleViewMarket} />
        );
      default:
        return <HomeFeed onViewMarket={handleViewMarket} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground">
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar activeScreen={activeScreen} onNavigate={(screen) => setActiveScreen(screen as Screen)} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto">
            {renderScreen()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeScreen={activeScreen} onNavigate={(screen) => setActiveScreen(screen as Screen)} />
    </div>
  );
}