import { createClient } from '@supabase/supabase-js';

// URL del proyecto y clave pública provistas por el panel de Supabase
const supabaseUrl = 'https://xyz-your-project-id.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);