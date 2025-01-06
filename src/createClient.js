import { createClient } from "@supabase/supabase-js";

// Supabase credentials
const supabaseUrl = 'https://velfmvmemrzurdweumyo.supabase.co'; // Replace with your project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbGZtdm1lbXJ6dXJkd2V1bXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTc2ODUsImV4cCI6MjA0OTIzMzY4NX0.wYS5iKIce0cf_yxnh8XGOYmhl0xW8gND5abvYRZEU1o'; // Replace with your anon key

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);