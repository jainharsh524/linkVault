
import { createClient } from '@supabase/supabase-js';

// These would normally come from process.env, but for this demo, 
// they act as placeholders for the user's specific Supabase project.
const SUPABASE_URL = 'https://asngobwuwmlnblnboomd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbmdvYnd1d21sbmJsbmJvb21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTA3NjAsImV4cCI6MjA4NjAyNjc2MH0.xnna8rcz0tPx1bJSTu2z1kNcg5tS_ZwDhkLCFJB5tZ0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * DATABASE SCHEMA REQUIREMENTS:
 * Table: vault_items
 * - id: uuid (primary key, default: uuid_generate_v4())
 * - type: text (not null, 'text' or 'file')
 * - content: text (not null)
 * - filename: text (nullable)
 * - password: text (nullable)
 * - expires_at: timestamp with time zone (not null)
 * - is_one_time: boolean (default: false)
 * - view_count: integer (default: 0)
 * - max_views: integer (nullable)
 * - created_at: timestamp with time zone (default: now())
 * 
 * Storage Bucket:
 * - links-vault (public or private based on preference, though app logic handles access)
 */
