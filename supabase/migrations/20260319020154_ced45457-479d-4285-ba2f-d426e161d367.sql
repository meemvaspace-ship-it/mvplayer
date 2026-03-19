-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites" ON public.favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create ads table
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ads" ON public.ads
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert ads" ON public.ads
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ads" ON public.ads
  FOR DELETE TO authenticated USING (true);

-- Create storage bucket for ads images
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('ads', 'ads', true, 10485760);

CREATE POLICY "Anyone can read ads bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'ads');

CREATE POLICY "Authenticated users can upload to ads bucket" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ads');

CREATE POLICY "Authenticated users can delete from ads bucket" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'ads');