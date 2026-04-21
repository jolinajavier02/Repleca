-- Repleca Studio: Cloudflare D1 (SQLite) Schema

-- 1. Organizations & Teams
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    plan_type TEXT DEFAULT 'free', -- free, pro, enterprise
    logo_url TEXT
);

-- 2. Profiles (Simplified for D1, Auth handled separately)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    organization_id TEXT REFERENCES organizations(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Projects (The Core Flow)
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id),
    created_by TEXT REFERENCES profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- video, image, presentation, podcast, script
    status TEXT DEFAULT 'draft', -- draft, exported, published, scheduled
    current_state TEXT, -- JSON representation of editor state
    metadata TEXT, -- JSON Ratios, resolution, duration
    tags TEXT, -- JSON array of tags
    folder_id TEXT,
    is_archived INTEGER DEFAULT 0, -- 0 for false, 1 for true
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Assets & Media Library
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id),
    uploaded_by TEXT REFERENCES profiles(id),
    name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Cloudflare R2 path
    content_type TEXT NOT NULL, -- video/mp4, image/png, audio/mpeg, etc.
    size_bytes INTEGER,
    metadata TEXT, -- JSON dimensions, bitrate, duration
    is_favorite INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Brand Kits
CREATE TABLE IF NOT EXISTS brand_kits (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id),
    name TEXT NOT NULL,
    colors TEXT, -- JSON array of hex codes
    fonts TEXT, -- JSON font family names and weights
    logo_urls TEXT, -- JSON Main, icon, wordmark
    watermark_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
