import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { store } from "@/store/appStore";
import { toast } from "sonner";

interface HistoryEntry {
  id: string;
  videoId: string;
  videoName: string;
  watchedAt: string;
}

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    store.getWatchHistory(user.id).then((h) => {
      setHistory(h);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await store.deleteWatchHistory(id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
      toast.success("Removed from history");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleClearAll = async () => {
    if (!user) return;
    try {
      await store.clearWatchHistory(user.id);
      setHistory([]);
      toast.success("History cleared");
    } catch {
      toast.error("Failed to clear history");
    }
  };

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, HistoryEntry[]> = {};
    history.forEach((h) => {
      const date = new Date(h.watchedAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      let label: string;
      if (diffDays === 0) label = "Today";
      else if (diffDays === 1) label = "Yesterday";
      else if (diffDays < 7) label = "This Week";
      else if (diffDays < 30) label = "This Month";
      else label = "Older";
      if (!groups[label]) groups[label] = [];
      groups[label].push(h);
    });
    return groups;
  }, [history]);

  const timelineOrder = ["Today", "Yesterday", "This Week", "This Month", "Older"];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Watch History</h1>
        </header>
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Sign in to see your watch history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Watch History</h1>
        </div>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>Clear All</Button>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No watch history yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {timelineOrder.map((label) => {
              const items = grouped[label];
              if (!items || items.length === 0) return null;
              return (
                <div key={label}>
                  <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {label}
                  </h2>
                  <div className="space-y-2 ml-3 border-l-2 border-border pl-4">
                    {items.map((h) => (
                      <div key={h.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground">{h.videoName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(h.watchedAt).toLocaleString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(h.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
