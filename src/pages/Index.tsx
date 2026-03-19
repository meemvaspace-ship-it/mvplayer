import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { store } from "@/store/appStore";
import { Video, Ad } from "@/types/video";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import CodeDialog from "@/components/CodeDialog";
import BookingDialog from "@/components/BookingDialog";
import VideoPlayer from "@/components/VideoPlayer";
import BottomNav, { NavTab } from "@/components/BottomNav";
import AdsCarousel from "@/components/AdsCarousel";
import { toast } from "sonner";

const Index = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterPlaylist, setFilterPlaylist] = useState("all");
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<{ id: string; name: string }[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [v, p, a] = await Promise.all([store.getVideos(), store.getPlaylists(), store.getAds()]);
        setVideos(v);
        setPlaylists(p);
        setAds(a);
        if (user) {
          const favs = await store.getFavorites(user.id);
          setFavorites(favs);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    load();
  }, [user]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    videos.forEach((v) => { if (v.category) cats.add(v.category); });
    return Array.from(cats);
  }, [videos]);

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.category.toLowerCase().includes(search.toLowerCase());
      const matchPlaylist = filterPlaylist === "all" || v.playlist === filterPlaylist;
      return matchSearch && matchPlaylist;
    });
  }, [videos, search, filterPlaylist]);

  const categoryVideos = useMemo(() => {
    if (!selectedCategory) return [];
    return videos.filter((v) => v.category === selectedCategory);
  }, [videos, selectedCategory]);

  const favoriteVideos = useMemo(() => {
    return videos.filter((v) => favorites.includes(v.id));
  }, [videos, favorites]);

  const handleWatch = (video: Video) => {
    setSelectedVideo(video);
    setShowCode(true);
  };

  const handleCodeSuccess = async () => {
    if (selectedVideo) {
      setShowPlayer(true);
      // Record watch history
      if (user) {
        try {
          await store.addWatchHistory(user.id, selectedVideo.id, selectedVideo.name);
        } catch (e) {
          console.error("Failed to record history", e);
        }
      }
    }
  };

  const handleBookCode = () => {
    setShowCode(false);
    setShowBooking(true);
  };

  const handleToggleFavorite = async (video: Video) => {
    if (!user) {
      toast.error("Please sign in to add favorites");
      return;
    }
    try {
      if (favorites.includes(video.id)) {
        await store.removeFavorite(user.id, video.id);
        setFavorites((prev) => prev.filter((id) => id !== video.id));
      } else {
        await store.addFavorite(user.id, video.id);
        setFavorites((prev) => [...prev, video.id]);
      }
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  const renderVideoGrid = (vids: Video[]) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {vids.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onWatch={handleWatch}
          isFavorite={favorites.includes(video.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );

  const renderHome = () => (
    <>
      <AdsCarousel ads={ads} />
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
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No videos found</p>
        </div>
      ) : renderVideoGrid(filtered)}
    </>
  );

  const renderCategory = () => (
    <>
      {selectedCategory ? (
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm text-primary mb-4 hover:underline"
          >
            ← Back to categories
          </button>
          <h2 className="text-lg font-bold text-foreground mb-4">{selectedCategory}</h2>
          {/* Show playlists in this category */}
          {(() => {
            const playlistsInCategory = new Set<string>();
            videos.forEach((v) => {
              if (v.category === selectedCategory && v.playlist) playlistsInCategory.add(v.playlist);
            });
            const playlistList = Array.from(playlistsInCategory);
            if (playlistList.length === 0) {
              return renderVideoGrid(categoryVideos);
            }
            return (
              <div className="space-y-6">
                {playlistList.map((pl) => {
                  const vids = categoryVideos.filter((v) => v.playlist === pl);
                  return (
                    <div key={pl}>
                      <h3 className="text-sm font-semibold text-primary mb-2">{pl}</h3>
                      {renderVideoGrid(vids)}
                    </div>
                  );
                })}
                {/* Videos without playlist */}
                {(() => {
                  const noPlaylist = categoryVideos.filter((v) => !v.playlist);
                  if (noPlaylist.length === 0) return null;
                  return (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Others</h3>
                      {renderVideoGrid(noPlaylist)}
                    </div>
                  );
                })()}
              </div>
            );
          })()}
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Categories</h2>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No categories yet</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="p-4 bg-card border border-border rounded-lg text-center hover:border-primary/40 transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">{cat}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {videos.filter((v) => v.category === cat).length} videos
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderSearch = () => (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" autoFocus />
      </div>
      {search ? renderVideoGrid(filtered) : (
        <p className="text-center text-muted-foreground py-8">Type to search videos...</p>
      )}
    </div>
  );

  const renderFavorite = () => (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Favorites</h2>
      {!user ? (
        <p className="text-muted-foreground text-center py-8">Sign in to see favorites</p>
      ) : favoriteVideos.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No favorites yet. Tap the heart icon on a video to add it.</p>
      ) : renderVideoGrid(favoriteVideos)}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-16 sm:pb-0">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "home" && renderHome()}
        {activeTab === "category" && renderCategory()}
        {activeTab === "search" && renderSearch()}
        {activeTab === "favorite" && renderFavorite()}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />

      <CodeDialog
        open={showCode}
        onOpenChange={(o) => { setShowCode(o); if (!o) setSelectedVideo(null); }}
        video={selectedVideo}
        onSuccess={handleCodeSuccess}
        onBookCode={handleBookCode}
      />

      <BookingDialog
        open={showBooking}
        onOpenChange={setShowBooking}
        video={selectedVideo}
        type="watch"
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
