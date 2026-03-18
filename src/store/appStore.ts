import { Video, Playlist, Booking } from "@/types/video";

const VIDEOS_KEY = "mv-videos";
const PLAYLISTS_KEY = "mv-playlists";
const BOOKINGS_KEY = "mv-bookings";

function get<T>(key: string, fallback: T): T {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const store = {
  getVideos: (): Video[] => get(VIDEOS_KEY, []),
  saveVideos: (v: Video[]) => set(VIDEOS_KEY, v),
  addVideo: (v: Video) => {
    const all = store.getVideos();
    all.push(v);
    store.saveVideos(all);
  },
  deleteVideo: (id: string) => {
    store.saveVideos(store.getVideos().filter((v) => v.id !== id));
  },

  getPlaylists: (): Playlist[] => get(PLAYLISTS_KEY, []),
  savePlaylists: (p: Playlist[]) => set(PLAYLISTS_KEY, p),
  addPlaylist: (p: Playlist) => {
    const all = store.getPlaylists();
    all.push(p);
    store.savePlaylists(all);
  },
  deletePlaylist: (id: string) => {
    store.savePlaylists(store.getPlaylists().filter((p) => p.id !== id));
  },

  getBookings: (): Booking[] => get(BOOKINGS_KEY, []),
  saveBookings: (b: Booking[]) => set(BOOKINGS_KEY, b),
  addBooking: (b: Booking) => {
    const all = store.getBookings();
    all.push(b);
    store.saveBookings(all);
  },
  markNotified: (id: string) => {
    const all = store.getBookings();
    const idx = all.findIndex((b) => b.id === id);
    if (idx >= 0) {
      all[idx].notified = true;
      store.saveBookings(all);
    }
  },
};
