import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exgphggbbxzbkfbiskah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Z3BoZ2diYnh6YmtmYmlza2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzE3MDgsImV4cCI6MjA2MTQ0NzcwOH0.3ADMO-yYEvWnDQhdScAKctheAG2j6YX8P5a-QgWeX0U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
