import { Home, Grid3X3, Search, Heart } from "lucide-react";

export type NavTab = "home" | "category" | "search" | "favorite";

interface Props {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
  { id: "category", label: "Category", icon: <Grid3X3 className="h-5 w-5" /> },
  { id: "search", label: "Search", icon: <Search className="h-5 w-5" /> },
  { id: "favorite", label: "Favorite", icon: <Heart className="h-5 w-5" /> },
];

const BottomNav = ({ active, onChange }: Props) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex justify-around items-center h-14 sm:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors ${
            active === tab.id ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {tab.icon}
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
