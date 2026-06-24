import { House, Train, Users, User } from '@phosphor-icons/react';

export type NavTab = 'home' | 'rutas' | 'comunidad' | 'perfil';

interface FloatingNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const TABS: Array<{ id: NavTab; label: string; icon: typeof House }> = [
  { id: 'home', label: 'Inicio', icon: House },
  { id: 'rutas', label: 'Mis rutas', icon: Train },
  { id: 'comunidad', label: 'Comunidad', icon: Users },
  { id: 'perfil', label: 'Perfil', icon: User },
];

const ITEM_H = 'h-11';

/**
 * Compact floating capsule nav. Inactive tabs: white circular icon buttons.
 * Active tab: black pill with icon + label side by side.
 */
export default function FloatingNavBar({ activeTab, onTabChange }: FloatingNavBarProps) {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-fit max-w-[calc(100%-2rem)] glass-card rounded-full py-1.5 px-1.5 flex items-center gap-1 shadow-[0_14px_44px_rgba(0,0,0,0.14)]">
      {TABS.map((tab) => {
        const IconComp = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center justify-center rounded-full select-none transition-all duration-200 cursor-pointer active:scale-95 shrink-0 ${
              isActive
                ? `flex-row gap-2 ${ITEM_H} w-auto px-3.5 text-white bg-black font-extrabold shadow-[0_6px_18px_rgba(0,0,0,0.28)]`
                : `${ITEM_H} w-11 bg-white text-neutral-600 border border-white/90 shadow-[0_2px_8px_rgba(15,23,42,0.06)] hover:text-black`
            }`}
          >
            <IconComp className="w-5 h-5 shrink-0" weight={isActive ? 'fill' : 'regular'} />
            {isActive && (
              <span className="text-[11px] font-extrabold whitespace-nowrap pr-0.5">
                {tab.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
