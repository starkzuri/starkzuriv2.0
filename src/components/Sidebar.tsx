import { Home, TrendingUp, PlusCircle, Wallet, User, Award, LogIn, UserPlus } from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

export function Sidebar({ activeScreen, onNavigate, isLoggedIn, onLogin }: SidebarProps) {
  const publicNavItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'market', icon: TrendingUp, label: 'Explore' },
  ];

  const authenticatedNavItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'market', icon: TrendingUp, label: 'Explore' },
    { id: 'create', icon: PlusCircle, label: 'Create' },
    { id: 'rewards', icon: Award, label: 'Rewards' },
    { id: 'portfolio', icon: Wallet, label: 'Portfolio' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const navItems = isLoggedIn ? authenticatedNavItems : publicNavItems;

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-[#0a0a0f] border-r border-[#1F87FC]/20 p-4 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1F87FC] to-[#00ffcc] flex items-center justify-center">
          <Award className="w-6 h-6 text-white" />
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

      {/* Auth Buttons or Footer Stats */}
      {!isLoggedIn ? (
        <div className="space-y-3 pt-4 border-t border-border">
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1F87FC] to-[#00ffcc] rounded-lg transition-all hover:shadow-[0_0_20px_rgba(31,135,252,0.5)] border border-[#1F87FC]"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span className="text-white">Connect Wallet</span>
          </button>
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0f0f1a] border border-[#1F87FC]/40 rounded-lg text-[#1F87FC] transition-all hover:bg-[#1F87FC]/10 hover:border-[#1F87FC]"
          >
            <UserPlus className="w-5 h-5" />
            <span>Sign Up</span>
          </button>
          <p className="text-xs text-center text-muted-foreground px-2 pt-2">
            Connect your wallet to start trading predictions
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
