import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Upload, Eye, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { store } from "@/store/appStore";
import { Video, Playlist, Booking } from "@/types/video";
import { toast } from "sonner";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState(store.getVideos());
  const [playlists, setPlaylists] = useState(store.getPlaylists());
  const [bookings, setBookings] = useState(store.getBookings());

  // Upload form state
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [playlist, setPlaylist] = useState("");
  const [category, setCategory] = useState("");
  const [downloadPrice, setDownloadPrice] = useState("");
  const [watchPrice, setWatchPrice] = useState("");
  const [downloadCode, setDownloadCode] = useState("");
  const [watchCode, setWatchCode] = useState("");
  const [newPlaylist, setNewPlaylist] = useState("");

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadVideo = () => {
    if (!name.trim() || !videoUrl.trim()) {
      toast.error("Name and video URL are required");
      return;
    }
    const video: Video = {
      id: crypto.randomUUID(),
      name: name.trim(),
      coverImage,
      videoUrl: videoUrl.trim(),
      playlist,
      category: category.trim(),
      downloadPrice: downloadPrice || "0",
      watchPrice: watchPrice || "0",
      downloadCode: downloadCode.trim(),
      watchCode: watchCode.trim(),
      createdAt: new Date().toISOString(),
    };
    store.addVideo(video);
    setVideos(store.getVideos());
    setName(""); setCoverImage(""); setVideoUrl(""); setPlaylist(""); setCategory("");
    setDownloadPrice(""); setWatchPrice(""); setDownloadCode(""); setWatchCode("");
    toast.success("Video uploaded!");
  };

  const handleDeleteVideo = (id: string) => {
    store.deleteVideo(id);
    setVideos(store.getVideos());
    toast.success("Video deleted");
  };

  const handleAddPlaylist = () => {
    if (!newPlaylist.trim()) return;
    const p: Playlist = { id: crypto.randomUUID(), name: newPlaylist.trim(), createdAt: new Date().toISOString() };
    store.addPlaylist(p);
    setPlaylists(store.getPlaylists());
    setNewPlaylist("");
    toast.success("Playlist created");
  };

  const handleDeletePlaylist = (id: string) => {
    store.deletePlaylist(id);
    setPlaylists(store.getPlaylists());
    toast.success("Playlist deleted");
  };

  const handleNotify = (b: Booking) => {
    store.markNotified(b.id);
    setBookings(store.getBookings());
    toast.success(`Code info notification marked for ${b.email}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="upload">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 mt-4">
            {/* Upload form */}
            <div className="bg-card p-4 rounded-lg border border-border space-y-3">
              <h2 className="font-semibold text-foreground">Upload New Video</h2>
              <Input placeholder="Video Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Video URL (direct link)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
              <div>
                <label className="text-sm text-muted-foreground">Cover Image</label>
                <Input type="file" accept="image/*" onChange={handleCoverUpload} />
                {coverImage && <img src={coverImage} alt="Preview" className="h-24 mt-2 rounded object-cover" />}
              </div>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                value={playlist}
                onChange={(e) => setPlaylist(e.target.value)}
              >
                <option value="">Select Playlist</option>
                {playlists.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
              <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Watch Price" value={watchPrice} onChange={(e) => setWatchPrice(e.target.value)} />
                <Input placeholder="Download Price" value={downloadPrice} onChange={(e) => setDownloadPrice(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Watch Code" value={watchCode} onChange={(e) => setWatchCode(e.target.value)} />
                <Input placeholder="Download Code" value={downloadCode} onChange={(e) => setDownloadCode(e.target.value)} />
              </div>
              <Button onClick={handleUploadVideo} className="w-full gap-2">
                <Upload className="h-4 w-4" /> Upload Video
              </Button>
            </div>

            {/* Video list */}
            <div className="space-y-2">
              <h2 className="font-semibold text-foreground">Uploaded Videos ({videos.length})</h2>
              {videos.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    {v.coverImage && <img src={v.coverImage} alt={v.name} className="h-10 w-16 object-cover rounded" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.category} • {v.playlist}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteVideo(v.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input
                placeholder="New Playlist Name"
                value={newPlaylist}
                onChange={(e) => setNewPlaylist(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddPlaylist()}
              />
              <Button onClick={handleAddPlaylist}><Plus className="h-4 w-4" /></Button>
            </div>
            {playlists.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                <span className="text-sm font-medium text-foreground">{p.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDeletePlaylist(p.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-3 mt-4">
            <h2 className="font-semibold text-foreground">Booking Submissions ({bookings.length})</h2>
            {bookings.length === 0 && <p className="text-muted-foreground text-sm">No bookings yet</p>}
            {bookings.map((b) => (
              <div key={b.id} className="p-3 bg-card border border-border rounded-lg space-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.name} — {b.type} code</p>
                    <p className="text-xs text-muted-foreground">{b.email} • {b.place}</p>
                    <p className="text-xs text-primary">Video: {b.videoName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</p>
                  </div>
                  {!b.notified && (
                    <Button variant="outline" size="sm" onClick={() => handleNotify(b)} className="gap-1">
                      <Mail className="h-3 w-3" /> Send Info
                    </Button>
                  )}
                  {b.notified && (
                    <span className="text-xs text-primary px-2 py-1 rounded-full bg-primary/10">Notified</span>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
