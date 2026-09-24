import type { UserRole, ActiveTab } from '../types';
import { Button } from './ui/button';
import { LogOut, Dog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function Navbar({ role, setRole, activeTab, setActiveTab }: NavbarProps) {
  const { user, setUser } = useAuth();
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('activeTab');
  };

    const getTabClass = (tabName: ActiveTab) =>
    `cursor-pointer transition-colors ${
      activeTab === tabName
        ? 'text-slate-600 text-orange-800 bg-orange-200'
        : 'text-slate-600 hover:text-orange-700 hover:bg-orange-100'
    }`;

  return (
    <header className="border-b bg-white px-6 py-3 flex items-center 
    justify-between sticky top-0 w-full z-500">
      {/* Left side: Brand + Tabs */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">🐾 Pet AdoptHub</h1>
        <nav className="flex gap-2">
          <Button
            variant={activeTab === 'apply' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('apply')}
            className={getTabClass('apply')}
          >
            Submit Request
          </Button>
          <Button
            variant={activeTab === 'review' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('review')}
            className={getTabClass('review')}
          >
            Review Dashboard
          </Button>
          {role === 'reviewer' && (
            <Button
              variant={activeTab === 'pets' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('pets')}
              className={`flex items-center gap-1 ${getTabClass('pets')}`}
            >
              <Dog className="h-4 w-4" />
              Manage Pets
            </Button>
          )}
        </nav>
      </div>

      {/* Right side: Active User info + Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {user.name} ({user.role})
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 
          hover:bg-red-50 border-red-200 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}