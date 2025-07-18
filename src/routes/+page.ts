import type { Session } from '@supabase/supabase-js';
import type { PageLoad } from './$types.ts';
export type ActionData = { error: string, session: Session, ok: boolean }
/**
 * This file checks if the URL has any parameters, if so, send this to page first.
 * @param params - URL Paramaters
 * @returns  - Object { error: string }
 */
export const load: PageLoad = (params) => {
  const err = params.url.searchParams.get("error")
  const ok = params.url.searchParams.get("success")


  try {
    if (err) {
      const error = JSON.parse(err)
      return { error: error[0].message, ok: false }
    }

    if (ok) {
      return { error:'', ok: true }
    }
    
    return { error:'', ok: false }
    
  
  } catch {

    return { error: err, ok: false }
  }
}