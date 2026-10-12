
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  campus TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID,
  seller_name TEXT NOT NULL DEFAULT 'Student',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('items','services','housing','events')),
  image_url TEXT,
  location TEXT NOT NULL DEFAULT 'On campus',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT SELECT ON public.listings TO anon;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active listings are viewable by everyone" ON public.listings FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);
CREATE POLICY "Signed-in users can create listings" ON public.listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own listings" ON public.listings FOR UPDATE TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own listings" ON public.listings FOR DELETE TO authenticated USING (auth.uid() = seller_id);

CREATE TABLE public.favorites (
  user_id UUID NOT NULL,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see their own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add their own favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove their own favorites" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO public.listings (seller_id, seller_name, title, description, price, category, location) VALUES
('00000000-0000-0000-0000-0000000000d1','Priya S.','Calculus Early Transcendentals 9th Ed','Barely used, no highlights. Perfect for MATH 101.',35,'items','North Campus Library'),
('00000000-0000-0000-0000-0000000000d2','Arjun M.','MacBook Air M2 13"','2023 model, 8GB/256GB, battery 94%. Includes charger and sleeve.',720,'items','Student Union'),
('00000000-0000-0000-0000-0000000000d3','Sneha R.','Mini Fridge — great for dorms','42L, quiet, one year old. Pickup only.',60,'items','Maple Hall'),
('00000000-0000-0000-0000-0000000000d4','Rahul V.','Statistics Tutoring (1-on-1)','A+ stats major offering exam prep and homework help. First session half price.',20,'services','Online or Library'),
('00000000-0000-0000-0000-0000000000d5','Ananya K.','Resume & LinkedIn Review','CS senior with 3 internship offers. 48h turnaround.',15,'services','Online'),
('00000000-0000-0000-0000-0000000000d6','Vikram T.','Room in 3BHK near East Gate','Furnished room, 5 min walk to campus. Utilities included. Available Jan 1.',450,'housing','East Gate Apartments'),
('00000000-0000-0000-0000-0000000000d7','Meera J.','Looking for a roommate — 2BHK','Female roommate preferred, quiet building, gym in complex.',380,'housing','Sunrise Residency'),
('00000000-0000-0000-0000-0000000000d8','Campus Music Club','Spring Fest — Early Bird Ticket','Two-day music festival on the main lawn. 12 artists, food trucks.',25,'events','Main Lawn'),
('00000000-0000-0000-0000-0000000000d9','Drama Society','Inter-College Theatre Night','Annual showcase, 6 short plays. Student discount at the door.',8,'events','Auditorium B');
