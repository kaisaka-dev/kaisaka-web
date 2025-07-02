import { supabaseAnonKey, supabaseURL } from '$lib/types/supabase.js'
import { createServerClient } from '@supabase/ssr'
import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

export const supabase: Handle = async ({ event, resolve }) => {
  
  event.locals.supabase = createServerClient(supabaseURL, supabaseAnonKey, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' })
        })
      },
    },
  })
  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null }
    }
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      // JWT validation has failed
      return { session: null, user: null }
    }
    return { session, user }
  }
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  const publicPaths = ['/', '/register/child'];
  const isPublic = publicPaths.includes(event.url.pathname);

  if (!session && !isPublic) {
    // Not authenticated and accessing a private route
    throw redirect(303, '/');
  }

  
  return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)