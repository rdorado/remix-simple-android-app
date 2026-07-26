-- Database initialization script for Simple Notes PostgreSQL Database

CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Personal',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    color_hex VARCHAR(20) NOT NULL DEFAULT '#FFF8E1',
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
CREATE INDEX IF NOT EXISTS idx_notes_pinned_timestamp ON notes(is_pinned DESC, timestamp DESC);

-- Seed initial records if empty
INSERT INTO notes (id, title, content, category, is_pinned, is_completed, color_hex, timestamp)
VALUES 
(1, 'Welcome to Simple Notes', 'Tap the + button to capture quick ideas, daily to-dos, or notes. Filter by category above or pin important notes!', 'Ideas', TRUE, FALSE, '#FEF3C7', 1700000000000),
(2, 'Grocery Shopping List', 'Fresh veggies, Almond Milk, Dark Chocolate, Oat cereal, and Organic coffee beans.', 'Tasks', FALSE, FALSE, '#E0E7FF', 1700000100000),
(3, 'Weekly Project Ideas', '1. Design a clean task dashboard\n2. Add custom color tags\n3. Test responsive layout on tablet', 'Work', FALSE, FALSE, '#D1FAE5', 1700000200000)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence value after manual inserts
SELECT setval('notes_id_seq', (SELECT MAX(id) FROM notes));
