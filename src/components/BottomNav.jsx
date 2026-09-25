import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, Trophy, Menu } from 'lucide-react';
import MoreDrawer from './MoreDrawer';

export default function BottomNav() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Quran', path: '/quran', icon: BookOpen },
    { label: 'Learn', path: '/qaida', icon: GraduationCap },
    { label: 'Quiz', path: '/quiz', icon: Trophy },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#061610]/95 backdrop-blur-xl border-t border-[#C5A059]/25 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  active 
                    ? 'text-[#C5A059] font-bold scale-105' 
                    : 'text-[#F5F1E6]/60 hover:text-[#F5F1E6]'
                }`}
              >
                <div className={`p-1 rounded-lg ${active ? 'bg-[#C5A059]/15' : ''}`}>
                  <Icon size={20} className={active ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          {/* More Drawer Trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              drawerOpen || location.pathname === '/progress' || location.pathname === '/vocab'
                ? 'text-[#C5A059] font-bold'
                : 'text-[#F5F1E6]/60 hover:text-[#F5F1E6]'
            }`}
          >
            <div className="p-1 rounded-lg">
              <Menu size={20} className="stroke-[1.8]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* More Drawer */}
      <MoreDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
