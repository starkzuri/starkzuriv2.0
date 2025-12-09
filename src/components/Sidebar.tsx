import { Home, TrendingUp, PlusSquare, Wallet, User, Zap } from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'market', label: 'Market', icon: TrendingUp },
    { id: 'create', label: 'Create', icon: PlusSquare },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-[#0a0a0f] border-r border-[#1F87FC]/20 p-4 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1F87FC] to-[#00ffcc] flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-foreground">StarkZuri</h2>
          <p className="text-xs text-muted-foreground">Predict · Trade · Win</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeScreen === item.id
                ? 'bg-[#1F87FC]/20 border border-[#1F87FC] text-[#1F87FC] shadow-[0_0_20px_rgba(31,135,252,0.3)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-[#1a1a24] border border-transparent'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Stats */}
      <div className="space-y-2 pt-4 border-t border-border">
        <div className="px-2 text-xs text-muted-foreground">
          <div className="flex justify-between mb-1">
            <span>Active Markets</span>
            <span className="text-[#1F87FC]">1,248</span>
          </div>
          <div className="flex justify-between">
            <span>24h Volume</span>
            <span className="text-[#1F87FC]">$2.4M</span>
          </div>
        </div>
      </div>
    </div>
  );
}
