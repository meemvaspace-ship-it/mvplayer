import { supabase } from "@/integrations/supabase/client";

export const store = {
  // Videos
  getVideos: async () => {
    const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((v: any) => ({
      id: v.id,
      name: v.name,
      coverImage: v.cover_image_url,
      videoUrl: v.video_url,
      playlist: v.playlist,
      category: v.category,
      downloadPrice: v.download_price,
      watchPrice: v.watch_price,
      downloadCode: v.download_code,
      watchCode: v.watch_code,
      createdAt: v.created_at,
    }));
  },

  addVideo: async (v: {
    name: string;
    coverImage: string;
    videoUrl: string;
    playlist: string;
    category: string;
    downloadPrice: string;
    watchPrice: string;
    downloadCode: string;
    watchCode: string;
  }) => {
    const { error } = await supabase.from("videos").insert({
      name: v.name,
      cover_image_url: v.coverImage,
      video_url: v.videoUrl,
      playlist: v.playlist,
      category: v.category,
      download_price: v.downloadPrice,
      watch_price: v.watchPrice,
      download_code: v.downloadCode,
      watch_code: v.watchCode,
    });
    if (error) throw error;
  },

  updateVideo: async (id: string, v: {
    name: string;
    playlist: string;
    category: string;
    watchPrice: string;
    watchCode: string;
    downloadPrice: string;
    downloadCode: string;
    coverImage?: string;
  }) => {
    const updates: any = {
      name: v.name,
      playlist: v.playlist,
      category: v.category,
      watch_price: v.watchPrice,
      watch_code: v.watchCode,
      download_price: v.downloadPrice,
      download_code: v.downloadCode,
    };
    if (v.coverImage !== undefined) updates.cover_image_url = v.coverImage;
    const { error } = await supabase.from("videos").update(updates).eq("id", id);
    if (error) throw error;
  },

  deleteVideo: async (id: string) => {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) throw error;
  },

  // Playlists
  getPlaylists: async () => {
    const { data, error } = await supabase.from("playlists").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((p: any) => ({ id: p.id, name: p.name, createdAt: p.created_at }));
  },

  addPlaylist: async (name: string) => {
    const { error } = await supabase.from("playlists").insert({ name });
    if (error) throw error;
  },

  deletePlaylist: async (id: string) => {
    const { error } = await supabase.from("playlists").delete().eq("id", id);
    if (error) throw error;
  },

  // Bookings
  getBookings: async () => {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((b: any) => ({
      id: b.id, videoId: b.video_id, videoName: b.video_name, type: b.type,
      name: b.name, email: b.email, place: b.place, createdAt: b.created_at, notified: b.notified,
    }));
  },

  addBooking: async (b: { videoId: string; videoName: string; type: "watch" | "download"; name: string; email: string; place: string }) => {
    const { error } = await supabase.from("bookings").insert({
      video_id: b.videoId, video_name: b.videoName, type: b.type, name: b.name, email: b.email, place: b.place,
    });
    if (error) throw error;
  },

  markNotified: async (id: string) => {
    const { error } = await supabase.from("bookings").update({ notified: true }).eq("id", id);
    if (error) throw error;
  },

  // Favorites
  getFavorites: async (userId: string) => {
    const { data, error } = await supabase.from("favorites").select("video_id").eq("user_id", userId);
    if (error) throw error;
    return (data || []).map((f: any) => f.video_id as string);
  },

  addFavorite: async (userId: string, videoId: string) => {
    const { error } = await supabase.from("favorites").insert({ user_id: userId, video_id: videoId });
    if (error) throw error;
  },

  removeFavorite: async (userId: string, videoId: string) => {
    const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("video_id", videoId);
    if (error) throw error;
  },

  // Ads
  getAds: async () => {
    const { data, error } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((a: any) => ({
      id: a.id, title: a.title, subtitle: a.subtitle, imageUrl: a.image_url, createdAt: a.created_at,
    }));
  },

  addAd: async (ad: { title: string; subtitle: string; imageUrl: string }) => {
    const { error } = await supabase.from("ads").insert({ title: ad.title, subtitle: ad.subtitle, image_url: ad.imageUrl });
    if (error) throw error;
  },

  deleteAd: async (id: string) => {
    const { error } = await supabase.from("ads").delete().eq("id", id);
    if (error) throw error;
  },

  // Watch History
  getWatchHistory: async (userId: string) => {
    const { data, error } = await supabase
      .from("watch_history")
      .select("*")
      .eq("user_id", userId)
      .order("watched_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((h: any) => ({
      id: h.id, videoId: h.video_id, videoName: h.video_name, watchedAt: h.watched_at,
    }));
  },

  addWatchHistory: async (userId: string, videoId: string, videoName: string) => {
    const { error } = await supabase.from("watch_history").insert({
      user_id: userId, video_id: videoId, video_name: videoName,
    });
    if (error) throw error;
  },

  deleteWatchHistory: async (id: string) => {
    const { error } = await supabase.from("watch_history").delete().eq("id", id);
    if (error) throw error;
  },

  clearWatchHistory: async (userId: string) => {
    const { error } = await supabase.from("watch_history").delete().eq("user_id", userId);
    if (error) throw error;
  },

  // Storage helpers
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  uploadFileWithProgress: async (
    bucket: string, path: string, file: File, onProgress: (percent: number) => void
  ): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID;

    if (!token) {
      throw new Error("Please sign in again before uploading files");
    }

    // Use TUS resumable upload for large files (>50MB), XHR for smaller ones
    const CHUNK_THRESHOLD = 50 * 1024 * 1024; // 50MB

    if (file.size > CHUNK_THRESHOLD) {
      // TUS resumable upload
      const { default: tus } = await import("tus-js-client");
      return new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          chunkSize: 6 * 1024 * 1024, // 6MB chunks
          headers: {
            authorization: `Bearer ${token}`,
            "x-upsert": "true",
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: bucket,
            objectName: path,
            contentType: file.type,
            cacheControl: "3600",
          },
          onError: (error) => {
            reject(new Error(`Upload failed: ${error.message}`));
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            onProgress(Math.round((bytesUploaded / bytesTotal) * 100));
          },
          onSuccess: () => {
            const { data } = supabase.storage.from(bucket).getPublicUrl(path);
            resolve(data.publicUrl);
          },
        });

        // Check for previous uploads to resume
        upload.findPreviousUploads().then((previousUploads) => {
          if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }
          upload.start();
        });
      });
    }

    // Standard XHR upload for smaller files
    const encodedPath = path
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          resolve(data.publicUrl);
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });
      xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      xhr.open("POST", `${supabaseUrl}/storage/v1/object/${bucket}/${encodedPath}`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("x-upsert", "true");
      xhr.send(file);
    });
  },
};
