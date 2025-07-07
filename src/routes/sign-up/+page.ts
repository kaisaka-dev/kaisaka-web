import type { PageLoad } from './$types.ts';

/**
 * This file checks if the URL has any parameters, if so, send this to page first.
 * @param params - URL Paramaters
 * @returns  - Object { error: string }
 */
export const load: PageLoad = (params) => {
  const err = params.url.searchParams.get("error")
  const ok = params.url.searchParams.get("success")

  console.log(err, ok)

  try {
    if (err) {
      const error = JSON.parse(err)
      return { error: error[0].message, success: false }
    }

    if (ok) {
      return { error:'', success: true }
    }
    
    return { error:'', success: false }
    
  
  } catch {

    return { error: err, success: false }
  }
}