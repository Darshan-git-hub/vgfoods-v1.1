export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'veg' | 'non-veg';
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type Database = {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: 'veg' | 'non-veg';
          image_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: Omit<MenuItem, 'id'>;
        Update: Partial<Omit<MenuItem, 'id'>>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
    };
  };
};