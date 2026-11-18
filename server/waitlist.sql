CREATE TABLE IF NOT EXISTS waitlist_signups (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('artist', 'client')),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 254),
  country TEXT NOT NULL,
  city TEXT NOT NULL CHECK (char_length(city) BETWEEN 2 AND 100),
  disciplines TEXT[] NOT NULL CHECK (cardinality(disciplines) BETWEEN 1 AND 5),
  booking_for TEXT,
  instagram TEXT,
  x_handle TEXT,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (type, email),
  CHECK ((type = 'client') = (booking_for IS NOT NULL))
);

COMMENT ON COLUMN waitlist_signups.disciplines IS
  'artist: what they do. client: who they want to book.';
