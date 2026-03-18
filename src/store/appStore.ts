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

  deleteVideo: async (id: string) => {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) throw error;
  },

  // Playlists
  getPlaylists: async () => {
    const { data, error } = await supabase.from("playlists").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      createdAt: p.created_at,
    }));
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
      id: b.id,
      videoId: b.video_id,
      videoName: b.video_name,
      type: b.type,
      name: b.name,
      email: b.email,
      place: b.place,
      createdAt: b.created_at,
      notified: b.notified,
    }));
  },

  addBooking: async (b: {
    videoId: string;
    videoName: string;
    type: "watch" | "download";
    name: string;
    email: string;
    place: string;
  }) => {
    const { error } = await supabase.from("bookings").insert({
      video_id: b.videoId,
      video_name: b.videoName,
      type: b.type,
      name: b.name,
      email: b.email,
      place: b.place,
    });
    if (error) throw error;
  },

  markNotified: async (id: string) => {
    const { error } = await supabase.from("bookings").update({ notified: true }).eq("id", id);
    if (error) throw error;
  },

  // Storage helpers
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },
};
