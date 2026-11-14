CREATE TABLE IF NOT EXISTS artist_waitlist (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email TEXT NOT NULL UNIQUE,
  discipline TEXT NOT NULL CHECK (
    discipline IN ('visual-arts', 'photography', 'film', 'design', 'other')
  ),
  portfolio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
