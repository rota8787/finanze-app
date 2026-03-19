-- Tabella delle categorie
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabella delle transazioni
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Politiche per categories
CREATE POLICY "Gli utenti possono vedere solo le proprie categorie"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono inserire le proprie categorie"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono aggiornare le proprie categorie"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono eliminare le proprie categorie"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- Politiche per transactions
CREATE POLICY "Gli utenti possono vedere solo le proprie transazioni"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono inserire le proprie transazioni"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono aggiornare le proprie transazioni"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono eliminare le proprie transazioni"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);
