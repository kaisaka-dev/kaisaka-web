import type { PageLoad } from './$types.ts';

/**
 * This file checks if the URL has any parameters, if so, send this to page first.
 * @param params - URL Paramaters
 * @returns  - Object { error: string }
 */
export const load: PageLoad = (params) => {
  const err = params.url.searchParams.get("error")

  try {
    if (!err) return {}

    const error = JSON.parse(err)
    return { error: error[0].message }
  
  } catch {

    return { error: err }
  }
}