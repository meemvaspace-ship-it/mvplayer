
-- Create playlists table
CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Anyone can read playlists
CREATE POLICY "Anyone can read playlists" ON public.playlists
  FOR SELECT USING (true);

-- Only authenticated users can manage playlists (admin-level, managed via app PIN)
CREATE POLICY "Authenticated users can insert playlists" ON public.playlists
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete playlists" ON public.playlists
  FOR DELETE TO authenticated USING (true);

-- Create videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cover_image_url TEXT DEFAULT '',
  video_url TEXT NOT NULL,
  playlist TEXT DEFAULT '',
  category TEXT DEFAULT '',
  download_price TEXT DEFAULT '0',
  watch_price TEXT DEFAULT '0',
  download_code TEXT DEFAULT '',
  watch_code TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read videos" ON public.videos
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert videos" ON public.videos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete videos" ON public.videos
  FOR DELETE TO authenticated USING (true);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  video_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('watch', 'download')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  place TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bookings" ON public.bookings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('videos', 'videos', true, 524288000);

-- Storage policies for videos bucket
CREATE POLICY "Anyone can read videos bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload to videos bucket" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can delete from videos bucket" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'videos');

-- Create storage bucket for covers
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('covers', 'covers', true, 10485760);

CREATE POLICY "Anyone can read covers bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload to covers bucket" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Authenticated users can delete from covers bucket" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'covers');
