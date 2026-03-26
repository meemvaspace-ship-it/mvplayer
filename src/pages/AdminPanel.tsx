import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Upload, Mail, Pencil, X, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { store } from "@/store/appStore";
import { Video, Playlist, Booking, Ad } from "@/types/video";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_PIN_KEY = "mv_admin_pin";
const DEFAULT_PIN = "74159";

const getAdminPin = () => localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
const setAdminPin = (pin: string) => localStorage.setItem(ADMIN_PIN_KEY, pin);

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);

  const [name, setName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [playlist, setPlaylist] = useState("");
  const [category, setCategory] = useState("");
  const [watchPrice, setWatchPrice] = useState("");
  const [watchCode, setWatchCode] = useState("");
  const [newPlaylist, setNewPlaylist] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadAbort, setUploadAbort] = useState<(() => void) | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    name: string; playlist: string; category: string;
    watchPrice: string; watchCode: string;
  }>({ name: "", playlist: "", category: "", watchPrice: "", watchCode: "" });
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const [adTitle, setAdTitle] = useState("");
  const [adSubtitle, setAdSubtitle] = useState("");
  const [adFile, setAdFile] = useState<File | null>(null);
  const [adPreview, setAdPreview] = useState("");
  const [adUploading, setAdUploading] = useState(false);

  // Change PIN state
  const [showChangePin, setShowChangePin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  const loadData = async () => {
    try {
      const [v, p, b, a] = await Promise.all([store.getVideos(), store.getPlaylists(), store.getBookings(), store.getAds()]);
      setVideos(v); setPlaylists(p); setBookings(b); setAds(a);
    } catch (e) { console.error("Failed to load admin data", e); }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setCoverFile(file); const r = new FileReader(); r.onloadend = () => setCoverPreview(r.result as string); r.readAsDataURL(file); }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setVideoFile(file); setVideoFileName(file.name); }
  };

  const handleUploadVideo = async () => {
    if (!user) {
      toast.error("Please sign in to upload videos");
      navigate("/login?redirect=/admin");
      return;
    }
    if (!name.trim() || !videoFile) { toast.error("Name and video file are required"); return; }
    setUploading(true); setUploadProgress(0);
    try {
      const videoPath = `${Date.now()}-${videoFile.name}`;
      const { promise, abort } = store.uploadFileWithProgress("videos", videoPath, videoFile, (p) => setUploadProgress(p));
      setUploadAbort(() => abort);
      const videoUrl = await promise;
      let coverImageUrl = "";
      if (coverFile) { const cp = `${Date.now()}-${coverFile.name}`; coverImageUrl = await store.uploadFile("covers", cp, coverFile); }
      await store.addVideo({ name: name.trim(), coverImage: coverImageUrl, videoUrl, playlist, category: category.trim(), downloadPrice: "0", watchPrice: watchPrice || "0", downloadCode: "", watchCode: watchCode.trim() });
      await loadData();
      setName(""); setCoverFile(null); setCoverPreview(""); setVideoFile(null); setVideoFileName(""); setPlaylist(""); setCategory(""); setWatchPrice(""); setWatchCode(""); setUploadProgress(0);
      toast.success("Video uploaded!");
    } catch (e: any) {
      if (e.message === "Upload cancelled") {
        toast.info("Upload cancelled");
      } else {
        toast.error("Upload failed: " + (e.message || "Unknown error"));
      }
    } finally { setUploading(false); setUploadAbort(null); }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!user) {
      toast.error("Please sign in to delete videos");
      navigate("/login?redirect=/admin");
      return;
    }
    try { await store.deleteVideo(id); await loadData(); toast.success("Video deleted"); } catch { toast.error("Failed to delete video"); }
  };

  const startEdit = (v: Video) => {
    setEditingId(v.id);
    setEditData({ name: v.name, playlist: v.playlist, category: v.category, watchPrice: v.watchPrice, watchCode: v.watchCode });
    setEditCoverFile(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    if (!user) {
      toast.error("Please sign in to edit videos");
      navigate("/login?redirect=/admin");
      return;
    }
    setEditSaving(true);
    try {
      let coverImage: string | undefined;
      if (editCoverFile) {
        const cp = `${Date.now()}-${editCoverFile.name}`;
        coverImage = await store.uploadFile("covers", cp, editCoverFile);
      }
      await store.updateVideo(editingId, { ...editData, downloadPrice: "0", downloadCode: "", coverImage });
      await loadData();
      setEditingId(null);
      toast.success("Video updated!");
    } catch (e: any) { toast.error("Update failed: " + (e.message || "Unknown error")); } finally { setEditSaving(false); }
  };

  const handleAddPlaylist = async () => {
    if (!user) {
      toast.error("Please sign in to manage playlists");
      navigate("/login?redirect=/admin");
      return;
    }
    if (!newPlaylist.trim()) return;
    try { await store.addPlaylist(newPlaylist.trim()); await loadData(); setNewPlaylist(""); toast.success("Playlist created"); } catch { toast.error("Failed to create playlist"); }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (!user) {
      toast.error("Please sign in to manage playlists");
      navigate("/login?redirect=/admin");
      return;
    }
    try { await store.deletePlaylist(id); await loadData(); toast.success("Playlist deleted"); } catch { toast.error("Failed to delete playlist"); }
  };

  const handleNotify = async (b: Booking) => {
    if (!user) {
      toast.error("Please sign in to manage bookings");
      navigate("/login?redirect=/admin");
      return;
    }
    try { await store.markNotified(b.id); await loadData(); toast.success(`Marked as notified for ${b.email}`); } catch { toast.error("Failed to update booking"); }
  };

  const handleAdImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setAdFile(file); const r = new FileReader(); r.onloadend = () => setAdPreview(r.result as string); r.readAsDataURL(file); }
  };

  const handleCreateAd = async () => {
    if (!user) {
      toast.error("Please sign in to create ads");
      navigate("/login?redirect=/admin");
      return;
    }
    if (!adTitle.trim() || !adFile) { toast.error("Title and image are required"); return; }
    setAdUploading(true);
    try {
      const path = `${Date.now()}-${adFile.name}`;
      const imageUrl = await store.uploadFile("ads", path, adFile);
      await store.addAd({ title: adTitle.trim(), subtitle: adSubtitle.trim(), imageUrl });
      await loadData(); setAdTitle(""); setAdSubtitle(""); setAdFile(null); setAdPreview("");
      toast.success("Ad created!");
    } catch (e: any) { toast.error("Failed to create ad: " + (e.message || "Unknown error")); } finally { setAdUploading(false); }
  };

  const handleDeleteAd = async (id: string) => {
    if (!user) {
      toast.error("Please sign in to delete ads");
      navigate("/login?redirect=/admin");
      return;
    }
    try { await store.deleteAd(id); await loadData(); toast.success("Ad deleted"); } catch { toast.error("Failed to delete ad"); }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm p-6 rounded-lg border border-border bg-card text-center space-y-4">
          <h1 className="text-xl font-bold text-foreground">Admin access requires sign in</h1>
          <p className="text-sm text-muted-foreground">Please sign in first, then enter your admin PIN.</p>
          <Button className="w-full" onClick={() => navigate("/login?redirect=/admin")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const handleChangePin = () => {
    if (currentPin !== getAdminPin()) {
      toast.error("Current PIN is incorrect");
      return;
    }
    if (newPin.length < 4) {
      toast.error("PIN must be at least 4 characters");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    setAdminPin(newPin);
    toast.success("PIN changed successfully!");
    setShowChangePin(false);
    setCurrentPin(""); setNewPin(""); setConfirmPin("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowChangePin(true)}>
          <Lock className="h-5 w-5" />
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="upload">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 mt-4">
            <div className="bg-card p-4 rounded-lg border border-border space-y-3">
              <h2 className="font-semibold text-foreground">Upload New Video</h2>
              <Input placeholder="Video Name" value={name} onChange={(e) => setName(e.target.value)} />
              <div>
                <label className="text-sm text-muted-foreground">Video File</label>
                <Input type="file" accept="video/*" onChange={handleVideoSelect} />
                {videoFileName && <p className="text-xs text-primary mt-1">Selected: {videoFileName}</p>}
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Cover Image</label>
                <Input type="file" accept="image/*" onChange={handleCoverSelect} />
                {coverPreview && <img src={coverPreview} alt="Preview" className="h-24 mt-2 rounded object-cover" />}
              </div>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={playlist} onChange={(e) => setPlaylist(e.target.value)}>
                <option value="">Select Playlist</option>
                {playlists.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Watch Price" value={watchPrice} onChange={(e) => setWatchPrice(e.target.value)} />
                <Input placeholder="Watch Code" value={watchCode} onChange={(e) => setWatchCode(e.target.value)} />
              </div>
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading video...</span>
                    <span className="font-semibold text-primary">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-3" />
                </div>
              )}
              <Button onClick={handleUploadVideo} className="w-full gap-2" disabled={uploading}>
                <Upload className="h-4 w-4" /> {uploading ? `Uploading... ${uploadProgress}%` : "Upload Video"}
              </Button>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold text-foreground">Uploaded Videos ({videos.length})</h2>
              {videos.map((v) => (
                <div key={v.id} className="p-3 bg-card border border-border rounded-lg">
                  {editingId === v.id ? (
                    <div className="space-y-3">
                      <Input placeholder="Name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={editData.playlist} onChange={(e) => setEditData({ ...editData, playlist: e.target.value })}>
                        <option value="">Select Playlist</option>
                        {playlists.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                      <Input placeholder="Category" value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Watch Price" value={editData.watchPrice} onChange={(e) => setEditData({ ...editData, watchPrice: e.target.value })} />
                        <Input placeholder="Watch Code" value={editData.watchCode} onChange={(e) => setEditData({ ...editData, watchCode: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Replace Cover Image (optional)</label>
                        <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setEditCoverFile(f); }} />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} disabled={editSaving} className="gap-1" size="sm">
                          <Check className="h-4 w-4" /> {editSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="outline" onClick={() => setEditingId(null)} size="sm" className="gap-1">
                          <X className="h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {v.coverImage && <img src={v.coverImage} alt={v.name} className="h-10 w-16 object-cover rounded" />}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">{v.name}</p>
                          <p className="text-xs text-muted-foreground">{v.category} • {v.playlist}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(v)}><Pencil className="h-4 w-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteVideo(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input placeholder="New Playlist Name" value={newPlaylist} onChange={(e) => setNewPlaylist(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddPlaylist()} />
              <Button onClick={handleAddPlaylist}><Plus className="h-4 w-4" /></Button>
            </div>
            {playlists.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                <span className="text-sm font-medium text-foreground">{p.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDeletePlaylist(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
                  {!b.notified ? (
                    <Button variant="outline" size="sm" onClick={() => handleNotify(b)} className="gap-1"><Mail className="h-3 w-3" /> Send Info</Button>
                  ) : (
                    <span className="text-xs text-primary px-2 py-1 rounded-full bg-primary/10">Notified</span>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="ads" className="space-y-6 mt-4">
            <div className="bg-card p-4 rounded-lg border border-border space-y-3">
              <h2 className="font-semibold text-foreground">Create New Ad</h2>
              <Input placeholder="Ad Title" value={adTitle} onChange={(e) => setAdTitle(e.target.value)} />
              <Input placeholder="Ad Subtitle (optional)" value={adSubtitle} onChange={(e) => setAdSubtitle(e.target.value)} />
              <div>
                <label className="text-sm text-muted-foreground">Ad Image</label>
                <Input type="file" accept="image/*" onChange={handleAdImageSelect} />
                {adPreview && <img src={adPreview} alt="Ad Preview" className="h-24 mt-2 rounded object-cover" />}
              </div>
              <Button onClick={handleCreateAd} className="w-full gap-2" disabled={adUploading}>
                <Plus className="h-4 w-4" /> {adUploading ? "Creating..." : "Create Ad"}
              </Button>
            </div>
            <div className="space-y-2">
              <h2 className="font-semibold text-foreground">Active Ads ({ads.length})</h2>
              {ads.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={ad.imageUrl} alt={ad.title} className="h-10 w-16 object-cover rounded" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">{ad.title}</p>
                      {ad.subtitle && <p className="text-xs text-muted-foreground">{ad.subtitle}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteAd(ad.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Change PIN Dialog */}
      <Dialog open={showChangePin} onOpenChange={setShowChangePin}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Admin PIN</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showCurrentPin ? "text" : "password"}
                placeholder="Current PIN"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                className="pr-10"
              />
              <button type="button" onClick={() => setShowCurrentPin(!showCurrentPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showCurrentPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNewPin ? "text" : "password"}
                placeholder="New PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="pr-10"
              />
              <button type="button" onClick={() => setShowNewPin(!showNewPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showNewPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Input
              type="password"
              placeholder="Confirm New PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
            />
            <Button className="w-full" onClick={handleChangePin}>Change PIN</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
