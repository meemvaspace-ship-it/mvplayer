export interface Video {
  id: string;
  name: string;
  coverImage: string;
  videoUrl: string;
  playlist: string;
  category: string;
  downloadPrice: string;
  watchPrice: string;
  downloadCode: string;
  watchCode: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  videoId: string;
  videoName: string;
  type: "watch" | "download";
  name: string;
  email: string;
  place: string;
  createdAt: string;
  notified: boolean;
}

export interface Ad {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  createdAt: string;
}
