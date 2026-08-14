import { createClient } from '@supabase/supabase-js';
import { parseResumeData, type Locale, type ResumeData } from '@portfolio/resume-schema';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = url && key ? createClient(url, key) : null;

export const loadPublishedResume = async (locale: Locale): Promise<ResumeData | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('resume_published')
    .select('content')
    .eq('locale', locale)
    .maybeSingle();

  if (error || !data) return null;

  const result = parseResumeData(data.content);
  return result.success ? result.data : null;
};
