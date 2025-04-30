import { createClient } from '@supabase/supabase-js';

/**
 * This Supabase client is for Supabase-specific features like:
 * - Authentication
 * - Storage
 * - Realtime subscriptions
 * - Edge Functions
 *
 * For database operations, use Prisma which connects to the same Supabase PostgreSQL database.
 */

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with the credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
