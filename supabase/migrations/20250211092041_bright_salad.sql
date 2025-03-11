/*
  # Initial menu items schema

  1. New Tables
    - menu_items
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (decimal)
      - category (text with check constraint for 'veg' or 'non-veg')
      - image_url (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on menu_items table
    - Add policies for public read access
    - Add policies for authenticated users to modify items
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('veg', 'non-veg')),
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Menu items are viewable by everyone" 
  ON menu_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only authenticated users can modify menu items" 
  ON menu_items 
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert initial menu items
INSERT INTO menu_items (name, description, price, category, image_url) VALUES
('Kal Dosa', '3 pcs with Sambar & Chutney', 5.99, 'veg', 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80'),
('Medhu Vadai', '2pcs Served with Sambar & Chutney', 2.50, 'veg', 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=600&q=80'),
('Veg Pakora', 'with gram flour fresh Mix Vegetables', 3.00, 'veg', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'),
('Chicken Curry', 'Plain Rice & Veg Side', 5.99, 'non-veg', 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80');