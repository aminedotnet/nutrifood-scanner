-- Create table for scanned products
CREATE TABLE IF NOT EXISTS public.scanned_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  image_url TEXT,
  calories NUMERIC,
  protein NUMERIC,
  carbs NUMERIC,
  fats NUMERIC,
  fiber NUMERIC,
  sugar NUMERIC,
  sodium NUMERIC,
  ingredients TEXT[],
  vitamins_minerals JSONB,
  ai_analysis TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.scanned_products ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own scanned products
CREATE POLICY "Users can view own scanned products"
ON public.scanned_products
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own scanned products
CREATE POLICY "Users can insert own scanned products"
ON public.scanned_products
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own scanned products
CREATE POLICY "Users can delete own scanned products"
ON public.scanned_products
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_scanned_products_user_id ON public.scanned_products(user_id);
CREATE INDEX idx_scanned_products_scanned_at ON public.scanned_products(scanned_at DESC);