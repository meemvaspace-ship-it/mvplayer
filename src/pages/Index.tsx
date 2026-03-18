import { useState, useMemo, useEffect } from "react";
import { Search, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { store } from "@/store/appStore";
import { Video } from "@/types/video";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import CodeDialog from "@/components/CodeDialog";
import BookingDialog from "@/components/BookingDialog";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const { user, login, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [filterPlaylist, setFilterPlaylist] = useState("all");
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<{ id: string; name: string }[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [codeType, setCodeType] = useState<"watch" | "download">("watch");
  const [showCode, setShowCode] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ video: Video; type: "watch" | "download" } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [v, p] = await Promise.all([store.getVideos(), store.getPlaylists()]);
        setVideos(v);
        setPlaylists(p);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.category.toLowerCase().includes(search.toLowerCase());
      const matchPlaylist = filterPlaylist === "all" || v.playlist === filterPlaylist;
      return matchSearch && matchPlaylist;
    });
  }, [videos, search, filterPlaylist]);

  const handleAction = (video: Video, type: "watch" | "download") => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }
    setSelectedVideo(video);
    setCodeType(type);
    setPendingAction({ video, type });
    setShowCode(true);
  };

  const handleCodeSuccess = () => {
    if (!pendingAction) return;
    if (pendingAction.type === "watch") {
      setSelectedVideo(pendingAction.video);
      setShowPlayer(true);
    } else {
      const a = document.createElement("a");
      a.href = pendingAction.video.videoUrl;
      a.download = pendingAction.video.name;
      a.click();
      toast.success("Download started!");
    }
    setPendingAction(null);
  };

  const handleBookCode = () => {
    setShowCode(false);
    setShowBooking(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterPlaylist} onValueChange={setFilterPlaylist}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Playlists" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Playlists</SelectItem>
              {playlists.map((p) => (
                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!user && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2 text-foreground">Welcome to MV Player</h2>
            <p className="text-muted-foreground mb-6">Sign in with Google to watch and download videos</p>
            <Button onClick={login} className="gap-2">
              <LogIn className="h-4 w-4" /> Sign In with Google
            </Button>
          </div>
        )}

        {user && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No videos found</p>
          </div>
        )}

        {user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onWatch={(v) => handleAction(v, "watch")}
                onDownload={(v) => handleAction(v, "download")}
              />
            ))}
          </div>
        )}
      </main>

      <CodeDialog
        open={showCode}
        onOpenChange={(o) => { setShowCode(o); if (!o) setPendingAction(null); }}
        video={selectedVideo}
        type={codeType}
        onSuccess={handleCodeSuccess}
        onBookCode={handleBookCode}
      />

      <BookingDialog
        open={showBooking}
        onOpenChange={setShowBooking}
        video={selectedVideo}
        type={codeType}
      />

      <VideoPlayer
        open={showPlayer}
        onOpenChange={setShowPlayer}
        video={selectedVideo}
      />
    </div>
  );
};

export default Index;
